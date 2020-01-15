import createTempUser from "../entities/TempUser";
import {generateUUID} from "../util/util";

export function makeSaveTempUser({usersTempDb, codeGenerator, usersDb}) {
    return async function saveUser(userData) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const validationCode = codeGenerator.alphaNumeric(6);
        userData.id = !userData.id ? generateUUID(32) : userData.id;  // generate an id if non given
        userData.code = validationCode;
        const tempUser = createTempUser(userData);

        // TODO: should it only use email, using id to ensure no collisions but might not be correct
        const existsRecord = await usersTempDb.findByIdOrEmail(tempUser.getId(), tempUser.getEmail()); // both fields must be unique
        if (existsRecord) {  // TODO: update expiration date and change verification code on found record
            response.statusCode = 200; // proceed
            response.message = "Verification code has been reset";
            return response;
        }
        const existsUser = await usersDb.findByIdOrEmail(tempUser.getId(), tempUser.getEmail());
        if (existsUser) {
            response.statusCode = 409; // conflict
            response.message = `A user with email ${tempUser.getEmail()} has already been registered.`;
            return response;
        }


        const codeExists = await usersTempDb.findByCode(validationCode);  // TODO: try generate 10 times before failing
        if (codeExists != null) {
            response.statusCode = 409; // conflict
            response.message = "Validation Code already in use try registering again.";
            return response;
        }

        const userToSave = {
            id: tempUser.getId(),
            firstName: tempUser.getFirstName(),
            lastName: tempUser.getLastName(),
            email: tempUser.getEmail(),
            dateCreated: tempUser.getDateCreated(),
            dateInserted: tempUser.getDateInserted(),
            expirationDate: tempUser.getExpirationDate(),
            code: validationCode
        };
        console.log("userToSave ", userToSave);

        let saveResult = await usersTempDb.insert(userToSave);

        response.statusCode = saveResult.httpStatus; // created
        response.message = saveResult.message;
        return response;
    }
}