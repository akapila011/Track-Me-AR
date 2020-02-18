import {isNumber, isString, isValidDate} from "../../util/util";

export function buildCreateTrackingSession({uuidValidator}) {
    return function createTrackingSession({id, trackingCode, trackingSecret, userId, startTime, endTime, updateInterval, forceStoppedAt}) {

        const validIdResult = uuidValidator.isValidUUID(id);
        if (!validIdResult.valid) {
            throw new Error(validIdResult.message);
        }

        if (!isString(trackingCode) && trackingCode.length < 10) {
            throw new Error("Tracking code must be a valid 10 character string");
        }

        if (userId) { // only if given
            const validUserIdResult = uuidValidator.isValidUUID(userId);
            if (!validUserIdResult.valid) {
                throw new Error(validUserIdResult.message);
            }
            trackingSecret = null;  // should not be generated if we know the user
        } else {
            userId = null;  // ensure null when not given
            if (!isString(trackingSecret) || !uuidValidator.isValidUUID(trackingSecret)) { // must use a tracking secret if we don'tknow the user
                throw new Error("Could not secure the tracking session for force-stop by anonymous user. Try again later.");
            }
        }

        if (!isValidDate(startTime)) {
            throw new Error("Invalid tracking session start time");
        }
        if (!isValidDate(endTime)) {
            throw new Error("Invalid tracking session end time");
        }
        if (endTime < startTime || endTime === startTime) {
            throw new Error(`Tracking session end time must be after the start time (${startTime})`);
        }

        if (!isNumber(updateInterval) || updateInterval < 5) { // seconds
            throw new Error(`The location interval must be at least 5 seconds, currently ${updateInterval}`);
        }

        if (forceStoppedAt) {
            if (!isValidDate(forceStoppedAt)) {
                throw new Error("Invalid tracking session force stop time");
            }
        } else {
            forceStoppedAt = null;
        }

        return Object.freeze({
            getId: () => id,
            getTrackingCode: () => trackingCode,
            getTrackingSecret: () => trackingSecret,
            getUserId: () => userId,
            getStartTime: () => startTime,
            getEndTime: () => endTime,
            getUpdateInterval: () => updateInterval,
            getForceStoppedAt: () => forceStoppedAt,
        })
    }
}