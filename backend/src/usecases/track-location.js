
export function makeTrackLocationUsecase({locationsDb, createLocation, trackingSessionsDb}) {
    return async function trackLocation(locationData) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs",
            finished: false
        };


        const trackingSessions = locationData.trackingId ? await trackingSessionsDb.findById(locationData.trackingId) : await trackingSessionsDb.findByTrackingCode(locationData.trackingCode);
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 404;
            response.message = "Could not determine the tracking session while posting latest location";
            return response;
        }
        const trackingSession = trackingSessions[0];
        locationData.trackingId = trackingSession.id;

        const location = createLocation(locationData);

        if (location.time > (trackingSession.endTime + trackingSession.updateInterval)) {
            response.statusCode = 304;
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