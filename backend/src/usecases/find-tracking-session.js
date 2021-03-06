import {addSecondsToDate} from "../util/util";

export function makeFindTrackingSessionUsecase({trackingSessionsDb}) {
    return async function findTrackingSession({trackingCode, onlyActive = true}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs",
            trackingCode: trackingCode,
            finished: false,
            startTime: null,
            endTime: null,
            url: null
        };

        const trackingSessions = await trackingSessionsDb.findByTrackingCode(trackingCode);
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 404;
            response.message = `No Tracking Sessions found for ${trackingCode}`;
            return response;
        }
        const trackingSession = trackingSessions[0];
        const now = new Date();

        if (!onlyActive) {  // return even inactive/force stopped ones
            if (trackingSession.forceStoppedAt != null) {
                response.statusCode = 200;
                response.message = "Tracking session has been stopped by the user";
                response.finished = true;
                return response;
            }
            if (now > addSecondsToDate(trackingSession.endTime, trackingSession.updateInterval)) {
                response.statusCode = 200;
                response.message = "Tracking session found but is almost about to finish";
                response.finished = true;
                return response;
            }
        }

        // return only if still on going - active
        response.statusCode = 200;
        response.message = `Tracking session found for ${trackingCode}`;
        response.finished = trackingSession.isFinished(now);
        response.startTime = trackingSession.startTime;
        response.endTime = trackingSession.endTime;
        // response.url = `http://localhost:5001/trackSession/${trackingCode}`;  // need a more dynamic way to avoid host:port
        return response;
    }
}