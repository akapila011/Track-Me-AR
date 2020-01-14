
export function makeVerifyUser({usersTempDb, usersDb, createTempUser, createCredential, saveCredential}) {
    return async function verifyUser({userCode, password}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const tempUserRecord = await usersTempDb.findByCode(userCode);
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

        // Make sure one more time that the id/email is not in use
        const existsUser = await usersDb.findByIdOrEmail(tempUser.getId(), tempUser.getEmail());  // TODO: separate checks to avoid wrong feedback
        if (existsUser) {
            response.statusCode = 409; // conflict
            response.message = `A user with email ${tempUser.getEmail()} has already been registered.`;
            return response;
        }

        const credential = createCredential({userId: tempUser.getId(), password: password});

        const user = {
            id: tempUser.getId(),
            firstName: tempUser.getFirstName(),
            lastName: tempUser.getLastName(),
            email: tempUser.getEmail(),
            dateCreated: tempUser.getDateCreated(),
        };
        usersDb.save(user);

        try {
            const result = await saveCredential(credential);
            if (result.statusCode === 200) {
                response.statusCode = 200;
                response.message = "Account is now setup.";
                return response;
            } else {
                response.statusCode = 200;
                response.message = `Account saved but password not set. ${result.message}. Try reset password.`;
                return response;
            }
        } catch (e) {
            console.error(e);
            response.statusCode = 200;
            response.message = `Account saved but password not set. Try reset password.`;
            return response;
        }
    }
}