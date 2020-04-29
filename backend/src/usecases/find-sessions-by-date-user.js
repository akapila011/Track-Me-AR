import {dateDifferenceInMinutes, getDayEnd, getDayStart, getDisplayDate, isValidDate} from "../util/util";

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

        const dayStart = getDayStart(parsedFilterDate);
        const dayEnd = getDayEnd(parsedFilterDate);
        const trackingSessions = await trackingSessionsDb.findBetweenTimesForUser(dayStart, dayEnd, userId);
        if (trackingSessions && trackingSessions.length < 1) {
            response.statusCode = 200;
            response.message = `No Tracking Sessions found on ${getDisplayDate(parsedFilterDate)}`;
            return response;
        }

        const trackingSessionIds = trackingSessions.map(trackingSession => trackingSession.id);
        const allLocations = await locationsDb.locationsByTrackingSessions(trackingSessionIds);

        const constructedData = {};  // trackingId: {trackingCode, startTime, endTime, forceStoppedAt, locations: []}
        trackingSessions.forEach(session => {
            if (!constructedData[session.id]) {
                constructedData[session.id] = {
                    trackingCode: session.trackingCode,
                    startTime: session.startTime,
                    endTime: session.endTime,
                    forceStoppedAt: session.forceStoppedAt,
                    duration: dateDifferenceInMinutes(session.startTime, session.forceStoppedAt ? session.forceStoppedAt : session.endTime),
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

        response.trackingSessions =  Object.values(constructedData);

        // return only if still on going - active
        response.statusCode = 200;
        response.message = `Found ${response.trackingSessions.length} sessions on ${getDisplayDate(parsedFilterDate)}`;
        return response;
    }
}