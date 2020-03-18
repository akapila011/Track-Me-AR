
export function makeValidateTrackSession({trackingSessionsDb, locationsDb}) {
    return async function validateTrackSession({trackingCode, getLatestLocation = false}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Cannot find tracking session to track at this time",
            finished: false
        };

        const trackingSessions = await trackingSessionsDb.findByTrackingCode(trackingCode);
        console.log("validate trackingSessions ", trackingSessions);
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 404;
            response.message = "Could not determine the tracking session";
            return response;
        }
        const trackingSession = trackingSessions[0];
        response.startTime = trackingSession.startTime;
        response.endTime = trackingSession.endTime;

        if (trackingSession.isFinished(new Date())) {
            response.statusCode = 310;
            response.message = "Tracking session has ended";
            response.finished = true;
            return response;
        }

        if (getLatestLocation) {
            const latestLocations = await locationsDb.findLatestByTrackingId(trackingSession.id);
            console.log("validate findLatestByTrackingId ", latestLocations);
            if (latestLocations && latestLocations.length < 1) {
                response.statusCode = 404;
                response.message = `Could not find any location data for session ${trackingCode}`;
                return response;
            }
            const latestLocation = latestLocations[0];
            response.latitude = latestLocation.latitude;
            response.longitude = latestLocation.longitude;
            response.locationTime = latestLocation.time;
        }



        response.statusCode = 200;
        response.message = "Found active session";
        return response;
    }
}