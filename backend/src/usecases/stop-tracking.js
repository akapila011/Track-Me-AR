import {addSecondsToDate} from "../util/util";

export function makeStopTrackingUsecase({trackingSessionsDb}) {
    return async function stopTracking({trackingCode, userId}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const trackingSessions = await trackingSessionsDb.findByTrackingCode(trackingCode);
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 404;
            response.message = "Could not determine the tracking session to be stopped. Refresh the page.";
            return response;
        }
        const trackingSession = trackingSessions[0];

        if (trackingSession.endTime > addSecondsToDate(trackingSession.endTime, trackingSession.updateInterval)) {
            response.statusCode = 200;
            response.message = "Tracking session has already ended";
            return response;
        }

        if (trackingSession.userId && trackingSession.userId !== userId) {
            response.statusCode = 403;
            response.message = "Login to ensure you can stop the session started by the user.";
            return response;
        } else {  // TODO: need secret key to avoid letting others end it

        }

        trackingSession.forceStoppedAt = new Date();

        let updateResult = await trackingSessionsDb.update(trackingSession);
        response.statusCode = updateResult.httpStatus;
        response.message = updateResult.httpStatus === 201 ? "Tracking session has been stopped" : updateResult.message;
        return response;
    }
}