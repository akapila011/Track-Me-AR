import createTempUser from "../entities/TempUser";

export function makeSaveTempUser({usersTempDb, codeGenerator, usersDb}) {
    return async function saveUser(userData) {
        const tempUser = createTempUser(userData);

        // TODO: should it only use email, using id to ensure no collisions but might not be correct
        const existsRecord = await usersTempDb.findByIdOrEmail(tempUser.getId(), tempUser.getEmail()); // both fields must be unique
        if (existsRecord) {  // TODO: update expiration date and change verification code on found record
            return "Email is already in uses";
        }
        const existsUser = await usersDb.findByIdOrEmail(tempUser.getId(), tempUser.getEmail());
        if (existsUser) {
            return `A user with email ${tempUser.getEmail()} has already been registered.`
        }

        const validationCode = codeGenerator.alphaNumeric(6);
        const codeExists = await usersTempDb.findByCode(validationCode);  // TODO: try generate 10 times before failing
        if (codeExists != null) {
            return "Validation Code already in use try registering again."
        }

        usersTempDb.insert({
            id: tempUser.getId(),
            firstName: tempUser.getFirstName(),
            lastName: tempUser.getLastName(),
            email: tempUser.getEmail(),
            dateCreated: tempUser.getDateCreated(),
            dateInserted: tempUser.getDateInserted(),
            expirationDate: tempUser.getExpirationDate(),
            code: validationCode
        });

        return "User has been saved";
    }
}