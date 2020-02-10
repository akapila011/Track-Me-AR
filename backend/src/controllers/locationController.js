import {statusCodeToType} from "../util/util";

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