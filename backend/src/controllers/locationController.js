import {getJwtObjectFromHttpRequest, statusCodeToType} from "../util/util";

export function makeStartTracking ({ startTrackingUsecase }) {
    return async function startTracking (httpRequest) {
        try {
            const userBody = httpRequest.body;

            const loggedInData = getJwtObjectFromHttpRequest(httpRequest); // optional data
            const response = await startTrackingUsecase({userId: loggedInData.userId, latitude: userBody.latitude, longitude: userBody.longitude, duration: 600});  // TODO: make duration flexible for logged in users
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: response.statusCode,

                body: { type: statusCodeToType(response.statusCode), message: response.message }
            }
        } catch (e) {
            // TODO: Error logging
            console.error(e);
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: {
                    type: "error",
                    message: e.message
                }
            }
        }
    }
}

export function makeTrackLocation ({ trackLocationUsecase }) {
    return async function trackLocation (httpRequest) {
        try {
            const userBody = httpRequest.body;

            const response = await trackLocationUsecase({latitude: userBody.latitude, longitude: userBody.longitude, trackingId: userBody.trackingId});
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: response.statusCode,

                body: { type: statusCodeToType(response.statusCode), message: response.message }
            }
        } catch (e) {
            // TODO: Error logging
            console.error(e);
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: {
                    type: "error",
                    message: e.message
                }
            }
        }
    }
}