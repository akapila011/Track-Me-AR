
export function makeVerifyUser({usersTempDb, usersDb, createTempUser}) {
    return async function verifyUser({userCode, password}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const tempUserRecord = usersTempDb.findByCode(userCode);
        if (tempUserRecord == null) {
            response.statusCode = 404;
            response.message = "Verification code not found.";
        }
        const tempUser = createTempUser(tempUserRecord);
        if (tempUser.isExpired()) {
            try {  // delete record
                usersTempDb.remove(tempUserRecord);  // record has _id
            } catch (e) {
                console.error(e.message);
            }
            response.statusCode = 400; // TODO: better code
            response.message = "This verification code has expired. Please restart registration to get a new code.";
            return response;
        }


    }
}