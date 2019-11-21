export function makeSaveUser ({ saveUserUsecase }) {
    return async function saveUser (httpRequest) {
        try {
            const userBody = httpRequest.body;


            const savedMessage = await saveUserUsecase({userBody});
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