
export function makeCreateCredential({credentialsDb, createCredential, usersDb}) {
    return async function saveCredential(credential) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const userAlreadyHasCredential = await credentialsDb.findByUserId(credential.getUserId());
        if (userAlreadyHasCredential != null) {  // TODO: maybe go directly to update?
            response.statusCode = 400;
            response.message = "User has already set a password. Please try update the password.";
            return response;
        }

        const userIsSaved = await usersDb.findByUserId(credential.getUserId());
        if (userIsSaved == null) {
            response.statusCode = 404;
            response.message = "User not found. Cannot save the credentials.";
            return response;
        }

        credentialsDb.insert({
            userId: credential.getUserId(),
            salt: credential.getSalt(),
            pHash: credential.getPHash(),
        });

        response.statusCode = 200;
        response.message = "Password has been saved.";
        return response;
    }
}