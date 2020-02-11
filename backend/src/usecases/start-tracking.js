import {addSecondsToDate, generateUUID} from "../util/util";

export function makeStartTrackingUsecase({trackingSessionsDb, createTrackingSession , locationsDb, createLocation, trackLocationUsecase, durationValidation}) {
    return async function startTracking(userId, latitude, longitude) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const trackingSessionData = {};
        trackingSessionData.id = generateUUID(32);
        trackingSessionData.userId = userId;
        trackingSessionData.startTime = new Date();

        const durationValidationResult = durationValidation.isValidTrackingDuration(trackingSessionData.duration);
        if (!durationValidationResult.valid) {
            response.statusCode = 400;
            response.message = durationValidationResult.message;
            return response;
        }
        trackingSessionData.endDate = addSecondsToDate(trackingSessionData.startTime, trackingSessionData.duration);
        trackingSessionData.updateInterval = 30; // TODO: see how to vary this later
        trackingSessionData.forceStoppedAt = null;

        const trackingsSession = createTrackingSession(trackingSessionData);

        const locationData = {
            latitude: latitude,
            longitude: longitude,
            time: trackingSessionData.startTime,
            trackingId: trackingSessionData.id,
        };

        const location = createLocation(locationData);  // To detect errors

        let saveResult = await trackingSessionsDb.insert(trackingsSession);
        response.statusCode = saveResult.httpStatus;
        response.message = saveResult.message;
        if (response.statusCode === 200) {
            const locationResponse = await trackLocationUsecase(locationData);
            if (locationResponse.statusCode !== 200) {
                try {
                    trackingSessionsDb.remove(saveResult.trackingSession);
                } catch (e) {
                    console.error(e);
                }
                response.statusCode = 500;
                response.message = "Tracking session valid but could not set initial location. Try again later."
            }
        }
        return response;
    }
}