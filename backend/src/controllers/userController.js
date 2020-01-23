import {statusCodeToType} from "../util/util";

export function makeSaveTempUser ({ saveTempUserUsecase }) {
    return async function saveUser (httpRequest) {
        try {
            const userBody = httpRequest.body;

            const response = await saveTempUserUsecase({firstName: userBody.firstName, lastName: userBody.lastName, email: userBody.email});
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
            const response = await verifyUserEmailUsecase({verificationCode: userBody.verificationCode, password: userBody.password});
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

export function makeSigninUser({ signinUserUsecase }) {
    return async function signinUser (httpRequest) {
        try {
            const userBody = httpRequest.body;
            const response = await signinUserUsecase({email: userBody.email, password: userBody.password});
            // const response = await signinUserUsecase({email: "abhzkapila999@gmail.com", password: "password1"});

            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: response.statusCode,
                body: { type: statusCodeToType(response.statusCode), message: response.message },
                cookies: response.cookies
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