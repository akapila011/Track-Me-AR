import {addSecondsToDate} from "../util/util";
import {isAuthorizedToModifyTrackingSession} from "./stop-tracking";
import {producer} from "../broker/LocationBroker";
import {log} from "../util/log";


export function makeTrackLocationUsecase({locationsDb, createLocation, trackingSessionsDb, publisher}) {
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

        console.log("publisher != null ", publisher != null);
        if (publisher != null) {  // publish to queue
            console.log("GONNA PUBLISH ")

            const data = locationToSave;
            data.trackingCode = trackingSession.trackingCode;
            data.startTime = trackingSession.startTime;
            data.endTime = trackingSession.endTime;
            data.isFinished = trackingSession.isFinished(new Date());
            delete data.trackingId;

            const payload = {topic: "trackingSessions", messages: JSON.stringify(data)};  // TODO: constants for topic and factory function for data
            console.log("GONNA PUBLISH THIS ", payload);
            let push_status = publisher.send([payload], (err, data) => {
                if (err) {
                    log.error('[kafka-producer -> broker publish failed');
                } else {
                    log.info('[kafka-producer -> broker publish success');
                }
            });
        }
        return response;
    }
}