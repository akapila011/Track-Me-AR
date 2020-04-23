import {isValidDate} from "../util/util";

export function makeFindSessionsByDateUser({trackingSessionsDb, locationsDb}) {
    return async function findSessionsByDateUser({filterDate, userId}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs",
            filterDate: filterDate,
            trackingSessions: [],  // list of objects {trackingCode: "xyz", locations: [{latitude: 1, longitude: 2, time}]
        };

        const parsedFilterDate = new Date(filterDate);
        if (!isValidDate(parsedFilterDate)) {
            response.statusCode = 400;
            response.message = "Invalid filter date";
            return response;
        }

        if (!userId) { // not logged in
            response.statusCode = 403;
            response.message = "Cannot determine user. Log in again to find sessions";
            return response;
        }

        const trackingSessions = await trackingSessionsDb.findByDateUser(parsedFilterDate, userId);
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 200;
            response.message = `No Tracking Sessions found on ${parsedFilterDate}`;
            return response;
        }

        const trackingSessionIds = trackingSessions.map(trackingSession => trackingSession.id);
        const allLocations = await locationsDb.locationsByTrackingSessions(trackingSessionIds);

        const constructedData = {};  // trackingId: {trackingCode, startTime, endTime, forceStoppedAt, locations: []}
        trackingSessions.forEach(session => {
            if (!session.id) {
                constructedData[session.id] = {
                    trackingCode: session.trackingCode,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    forceStoppedAt: session.forceStoppedAt,
                    duration: session.forceStoppedAt ? session.forceStoppedAt - session.startTime : session.endTime,
                    locations: []
                }
            }
        });
        allLocations.forEach(location => {
            if (constructedData[location.trackingId]) {
                constructedData[location.trackingId]["locations"].push({
                    id: location.id,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    time: location.time,
                })
            }
        });

        constructedData.trackingSessions =  Object.values(constructedData);

        // return only if still on going - active
        response.statusCode = 200;
        response.message = `Found ${response.trackingSessions.length} sessions on ${filterDate}`;
        return response;
    }
}