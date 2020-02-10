
export function makeTrackLocationUsecase({locationsDb, createLocation}) {
    return async function trackLocation(locationData) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const location = createLocation(locationData);

        const trackingSessions = null;
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 404;
            response.message = "Could not determine the tracking session while posting latest location";
            return response;
        }
        const trackingSession = null;

        if (location.time > (trackingSession.endTime + trackingSession.updateInterval)) {
            response.statusCode = 304;
            response.message = "Tracking session has ended";
            return response;
        }


        const locationToSave = {
            latitude: location.getLatitude(),
            longitude: location.getLongitude(),
            time: location.getTime(),
            trackingId: location.getTrackingId(),
        };
        // console.log("locationToSave ", locationToSave);

        let saveResult = await locationsDb.insert(locationToSave);
        response.statusCode = saveResult.httpStatus; // created
        response.message = saveResult.message;
        return response;
    }
}