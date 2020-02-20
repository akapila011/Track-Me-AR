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

                body: { type: statusCodeToType(response.statusCode),
                    message: response.message,
                    trackingCode: response.trackingCode,
                    trackingEndTime: response.trackingEndTime,
                    trackingUrl: response.trackingUrl,
                    trackingUpdateInterval: response.trackingUpdateInterval,
                    trackingSecret: response.trackingSecret,
                }
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

            const loggedInData = getJwtObjectFromHttpRequest(httpRequest); // optional data
            const locationData = {latitude: userBody.latitude, longitude: userBody.longitude, trackingCode: userBody.trackingCode};
            const response = await trackLocationUsecase({locationData: locationData, userId: loggedInData.userId, trackingSecret: userBody.trackingSecret});
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: response.statusCode,

                body: { type: statusCodeToType(response.statusCode),
                    message: response.message,
                    finished: response.finished
                }
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

export function makeStopTracking ({ stopTrackingUsecase }) {
    return async function stopTracking (httpRequest) {
        try {
            const userBody = httpRequest.body;

            const loggedInData = getJwtObjectFromHttpRequest(httpRequest); // optional data
            const response = await stopTrackingUsecase({trackingCode: userBody.trackingCode, userId: loggedInData.userId, trackingSecret: userBody.trackingSecret});
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: response.statusCode,
                body: { type: statusCodeToType(response.statusCode), message: response.message}
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

export function makeFindTrackingSession ({ findTrackingSessionUsecase }) {
    return async function findTrackingSession (httpRequest) {
        try {
            const userBody = httpRequest.body;

            // const loggedInData = getJwtObjectFromHttpRequest(httpRequest); // optional data
            const response = await findTrackingSessionUsecase({trackingCode: userBody.trackingCode});
            response.type = statusCodeToType(response.statusCode);
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: response.statusCode,
                body: response
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