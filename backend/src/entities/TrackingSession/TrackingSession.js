import {isNumber, isValidDate} from "../../util/util";

export function buildCreateTrackingSession({uuidValidator}) {
    return function createTrackingSession({id, userId, startTime, endTime, updateInterval, forceStoppedAt}) {

        const validIdResult = uuidValidator.isValidUUID(id);
        if (!validIdResult.valid) {
            throw new Error(validIdResult.message);
        }

        if (userId) { // only if given
            const validUserIdResult = uuidValidator.isValidUUID(userId);
            if (!validUserIdResult.valid) {
                throw new Error(validUserIdResult.message);
            }
        } else {  // ensure null when not given
            userId = null;
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
            getUserId: () => userId,
            getStartTime: () => startTime,
            getEndTime: () => endTime,
            getUpdateInterval: () => updateInterval,
            getForceStoppedAt: () => forceStoppedAt,
        })
    }
}