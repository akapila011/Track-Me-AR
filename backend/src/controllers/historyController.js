import {getJwtObjectFromHttpRequest, statusCodeToType} from "../util/util";

export function makeFindSessionsByDateUser ({ findSessionsByDateUserUsecase }) {
    return async function findSessionsByDateUser (httpRequest) {
        try {
            const userBody = httpRequest.body;

            const loggedInData = getJwtObjectFromHttpRequest(httpRequest); // optional data
            const response = await findSessionsByDateUserUsecase(
                {
                    filterDate: userBody.filterDate,
                    userId: loggedInData.userId,
                });
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: response.statusCode,

                body: {
                    type: statusCodeToType(response.statusCode),
                    message: response.message,
                    filterDate: response.filterDate,
                    trackingSessions: response.trackingSessions
                }
            }
        } catch (e) {
            log.error("makeStartTracking ", e);
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