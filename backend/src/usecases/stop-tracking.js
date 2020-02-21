import {addSecondsToDate} from "../util/util";

export function makeStopTrackingUsecase({trackingSessionsDb}) {
    return async function stopTracking({trackingCode, userId, trackingSecret}) {
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

        if (trackingSession.isFinished(trackingSession.endTime)) {
            response.statusCode = 310;
            response.message = "Tracking session has already ended";
            return response;
        }

        const authorizedToModify = isAuthorizedToModifyTrackingSession(trackingSession, userId, trackingSecret);
        if (authorizedToModify.statusCode !== 200) {
            response.statusCode = authorizedToModify.statusCode || 401;
            response.message = authorizedToModify.message || "Not authorized to stop this tracking session";
            return response;
        }

        trackingSession.forceStoppedAt = new Date();

        let updateResult = await trackingSessionsDb.update(trackingSession);
        response.statusCode = updateResult.httpStatus;
        response.message = updateResult.httpStatus === 200 ? "Tracking session has been stopped" : updateResult.message;
        return response;
    }
}

export function isAuthorizedToModifyTrackingSession(trackingSession, userId, trackingSecret) {
    const response = {
        statusCode: 405,
        message: "Tracking session is malformed. Cannot be modified."
    };
    if (trackingSession.userId != null) {
        if (trackingSession.userId === userId) {
            response.statusCode = 200;
            response.message = "Authorized to modify tracking session";
            return response;
        } else {
            response.statusCode = 401;
            response.message = `The tracking session (${trackingSession.trackingCode}) was created by a logged in user and can only be modified by that user.`;
            return response;
        }
    }
    else if (trackingSession.trackingSecret != null) {
        if (trackingSession.trackingSecret === trackingSecret) {
            response.statusCode = 200;
            response.message = "Authorized to modify tracking session";
            return response;
        } else {
            response.statusCode = 401;
            response.message = `The tracking session (${trackingSession.trackingCode}) was created by an anonymous user and cannot be modified with authorization`;
            return response;
        }
    }
    return response

}