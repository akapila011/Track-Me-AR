
export function makeCreateCredential({credentialsDb, createCredential, usersDb}) {
    return async function saveCredential(credential) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const userAlreadyHasCredential = await credentialsDb.findByUserId(credential.getUserId());
        if (userAlreadyHasCredential && userAlreadyHasCredential.length > 0) {  // TODO: maybe go directly to update?
            response.statusCode = 400;
            response.message = "User has already set a password. Please try update the password.";
            return response;
        }

        const userIsSaved = await usersDb.findById(credential.getUserId());
        if (userIsSaved && userIsSaved.length < 1) {
            response.statusCode = 404;
            response.message = "User not found. Cannot save the credentials.";
            return response;
        }

        let result = await credentialsDb.insert({
            userId: credential.getUserId(),
            salt: credential.getSalt(),
            pHash: credential.getPHash(),
        });

        response.statusCode = result.httpStatus;
        response.message = result.message;
        return response;
    }
}