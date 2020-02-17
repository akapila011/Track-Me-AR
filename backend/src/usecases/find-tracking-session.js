import {addSecondsToDate} from "../util/util";

export function makeFindTrackingSession({trackingSessionsDb}) {
    return async function findTrackingSession({trackingCode, onlyActive = true}) {
        const response = {  // TODO: determine payload to send back - event stream url, endTime, startTime
            statusCode: 500,
            message: "Unknown Error: Check Logs",
            finished: false
        };

        const trackingSessions = await trackingSessionsDb.findByTrackingCode(trackingCode);
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 404;
            response.message = `No Tracking Sessions found for ${trackingCode}`;
            return response;
        }
        const trackingSession = trackingSessions[0];

        if (!onlyActive) {  // return even inactive/force stopped ones
            if (trackingSession.forceStoppedAt != null) {
                response.statusCode = 200;
                response.message = "Tracking session has been stopped by the user";
                response.finished = true;
                return response;
            }
            if (new Date() > addSecondsToDate(trackingSession.endTime, trackingSession.updateInterval)) {
                response.statusCode = 200;
                response.message = "Tracking session found but is almost about to finish";
                response.finished = true;
                return response;
            }
        }

        // return only if still on going - active

        response.statusCode = 200;
        response.message = `Tracking session found for ${trackingCode}`;
        return response;
    }
}