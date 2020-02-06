import {isNumber, isValidDate} from "../../util/util";

export function buildCreateLocation() {
    return function createCredential({latitude, longitude, time = new Date(), trackingId}) {

        if (!isNumber(latitude) || !isNumber(longitude)) {
            throw new Error("Latitude and Longitude must be numbers");
        }

        if (latitude > 90.0 || latitude < -90.0) {
            throw new Error("Latitude must be between 90(N) and -90(S)");
        }

        if (longitude > 180.0 || latitude < -180.0) {
            throw new Error("Latitude must be between 180(W) and -180(E)");
        }

        // TODO: validate trackingId based on length once tracking session created, dependency to be injected for checking that

        return Object.freeze({
            getLatitude: () => latitude,
            getLongitude: () => longitude,
            getTime: () => time,
            getTrackingId: () => trackingId,
        })
    }
}