import {isNumber, isValidDate} from "../../util/util";

export function buildCreateLocation({trackingIdValidator}) {
    return function createCredential({latitude, longitude, time = new Date(), trackingId}) {

        if (!isNumber(latitude) || !isNumber(longitude)) {
            throw new Error("Latitude and Longitude must be numbers");
        }

        if (latitude > 90.0 || latitude < -90.0) {
            throw new Error("Latitude must be between 90(N) and -90(S)");
        }

        if (longitude > 180.0 || longitude < -180.0) {
            throw new Error("Latitude must be between 180(W) and -180(E)");
        }

        const validIdResult = trackingIdValidator.isValidUUID(trackingId);
        if (!validIdResult.valid) {
            throw new Error(validIdResult.message);
        }

        return Object.freeze({
            getLatitude: () => latitude,
            getLongitude: () => longitude,
            getTime: () => time,
            getTrackingId: () => trackingId,
        })
    }
}