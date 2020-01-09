import {statusCodeToType} from "../util/util";

export function makeSaveTempUser ({ saveTempUserUsecase }) {
    return async function saveUser (httpRequest) {
        try {
            const userBody = httpRequest.body;

            // console.log("userBody ", userBody);
            const response = await saveTempUserUsecase({firstName: userBody.firstName, lastName: userBody.lastName, email: userBody.email});
            // console.log("response ", response);
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

export function makeVerifyUser ({ verifyUserUsecase: verifyUserEmailUsecase }) {
    return async function verifyUser (httpRequest) {
        try {
            const userBody = httpRequest.body;


            const response = await verifyUserEmailUsecase({userBody});
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: response.statusCode,
                body: { message: response.message }
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
                    error: e.message
                }
            }
        }
    }
}