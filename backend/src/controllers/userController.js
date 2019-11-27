export function makeSaveTempUser ({ saveTempUserUsecase }) {
    return async function saveUser (httpRequest) {
        try {
            const userBody = httpRequest.body;

            const savedMessage = await saveTempUserUsecase({userBody});
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: 201,
                body: { message: savedMessage }
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

export function makeVerifyUser ({ verifyUserUsecase: verifyUserEmailUsecase }) {
    return async function saveUser (httpRequest) {
        try {
            const userBody = httpRequest.body;


            const savedMessage = await verifyUserEmailUsecase({userBody});
            return {
                headers: {
                    'Content-Type': 'application/json',
                },
                statusCode: 201,
                body: { message: savedMessage }
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