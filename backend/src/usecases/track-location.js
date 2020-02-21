import {addSecondsToDate} from "../util/util";
import {isAuthorizedToModifyTrackingSession} from "./stop-tracking";

export function makeTrackLocationUsecase({locationsDb, createLocation, trackingSessionsDb}) {
    return async function trackLocation({locationData, userId, trackingSecret}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs",
            finished: false
        };

        const trackingSessions = locationData.trackingId ?
            await trackingSessionsDb.findById(locationData.trackingId) :
            await trackingSessionsDb.findByTrackingCode(locationData.trackingCode);
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 404;
            response.message = "Could not determine the tracking session while posting latest location";
            return response;
        }
        const trackingSession = trackingSessions[0];

        const authorizedToModify = isAuthorizedToModifyTrackingSession(trackingSession, userId, trackingSecret);
        if (authorizedToModify.statusCode !== 200) {
            response.statusCode = authorizedToModify.statusCode || 401;
            response.message = authorizedToModify.message || "Not authorized to stop this tracking session";
        }


        locationData.trackingId = trackingSession.id;

        const location = createLocation(locationData);

        if (trackingSession.isFinished(location.getTime())) {
            response.statusCode = 310;
            response.message = "Tracking session has ended";
            response.finished = true;
            return response;
        }

        const locationToSave = {
            latitude: location.getLatitude(),
            longitude: location.getLongitude(),
            time: location.getTime(),
            trackingId: location.getTrackingId(),
        };
        console.log("Tracking ", locationToSave);

        let saveResult = await locationsDb.insert(locationToSave);
        response.statusCode = saveResult.httpStatus; // created
        response.message = saveResult.message;
        return response;
    }
}