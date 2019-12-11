
export function makeCreateCredential({credentialsDb, createCredential, usersDb}) {
    return async function saveCredential(userId, password, salt) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const credential = createCredential({userId, password, salt});

        const userAlreadyHasCredential = await credentialsDb.findByUserId(userId);
        if (userAlreadyHasCredential != null) {  // TODO: maybe go directly to update?
            response.statusCode = 400;
            response.message = "User has already set a password. Please try update the password.";
            return response;
        }

        const userIsSaved = await usersDb.findByUserId(userId);
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

        response.statusCode = 400;
        response.message = "Password has been saved.";
        return response;
    }
}