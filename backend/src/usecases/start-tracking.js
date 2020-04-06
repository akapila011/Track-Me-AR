import {addSecondsToDate, generateUUID} from "../util/util";

export function makeStartTrackingUsecase({trackingSessionsDb, createTrackingSession , locationsDb, createLocation, trackLocationUsecase, durationValidation, codeGenerator}) {
    return async function startTracking({userId, latitude, longitude, duration}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const trackingSessionData = {};
        trackingSessionData.id = generateUUID();
        trackingSessionData.trackingCode = codeGenerator.alphaNumeric(10);
        const duplicateTrackingCodes = await trackingSessionsDb.findByTrackingCode(trackingSessionData.trackingCode);
        if (duplicateTrackingCodes && duplicateTrackingCodes.length > 1) {
            trackingSessionData.trackingCode = codeGenerator.alphaNumeric(10); // TODO: do x retries or move this check to exception catch
        }

        trackingSessionData.userId = userId ? userId : null;
        trackingSessionData.trackingSecret = trackingSessionData.userId ? null : generateUUID();
        trackingSessionData.startTime = new Date();

        duration = userId ? duration ? duration : 600 : 600;  // if logged in use sent duration, if not sent use default, if not logged in default
        const durationValidationResult = durationValidation.isValidTrackingDuration(duration);
        if (!durationValidationResult.valid) {
            response.statusCode = 400;
            response.message = durationValidationResult.message;
            return response;
        }
        trackingSessionData.endTime = addSecondsToDate(trackingSessionData.startTime, duration);
        trackingSessionData.updateInterval = 20; // TODO: see how to vary this later
        trackingSessionData.forceStoppedAt = null;

        const trackingSession = createTrackingSession(trackingSessionData);

        const locationData = {
            latitude: latitude,
            longitude: longitude,
            time: trackingSessionData.startTime,
            trackingId: trackingSessionData.id,
        };

        const location = createLocation(locationData);  // To detect errors

        let saveResult = await trackingSessionsDb.insert(trackingSessionData);
        response.statusCode = saveResult.httpStatus;
        response.message = response.statusCode === 200 ? "Tracking session started" : response.statusCode;
        if (response.statusCode === 200) {
            const locationResponse = await trackLocationUsecase({locationData: locationData,
                userId: trackingSession.getUserId(), trackingSecret: trackingSession.getTrackingSecret()});
            if (locationResponse.statusCode !== 200) {
                try {
                    trackingSessionsDb.remove(saveResult.trackingSession);
                } catch (e) {
                    console.error(e);
                }
                response.statusCode = 500;
                response.message = "Tracking session valid but could not set initial location. Try again later."
            } else { // all went well
                response.trackingCode = trackingSession.getTrackingCode();
                response.trackingEndTime = trackingSession.getEndTime();
                response.trackingUpdateInterval = trackingSession.getUpdateInterval();
                response.trackingUrl = ``;  // TODO: figure this from configs once it is working on front-end
                response.trackingSecret = trackingSession.getTrackingSecret();
            }
        }
        return response;
    }
}