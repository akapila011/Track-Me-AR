
export function makeSaveTempUser({credentialsDb, createCredential, usersDb}) {
    return async function saveCredential(userId, password, salt) {

        const credential = createCredential({userId, password, salt});

        const userAlreadyHasCredential = await credentialsDb.findByUserId(userId);
        if (userAlreadyHasCredential != null) {  // TODO: maybe go directly to update?
            return "User has already set a password. Please try update the password."
        }

        const userIsSaved = await usersDb.findByUserId(userId);
        if (userIsSaved == null) {
            return "User has not been saved. Cannot save the credentials."
        }

        credentialsDb.insert({
            userId: credential.getUserId(),
            salt: credential.getSalt(),
            pHash: credential.getPHash(),
        });

        return "Password has been saved";
    }
}