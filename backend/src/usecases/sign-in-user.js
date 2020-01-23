
export function makeSignInUserUsecase({usersDb, credentialsDb, hashing}) {
    return async function signInUser({email, password}) {
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };


        const existingUsers = await usersDb.findByEmail(email);
        if (existingUsers && existingUsers.length < 1) {
            response.statusCode = 404;
            response.message = `No account '${email}' found.`;
            return response;
        }
        const user = existingUsers[0];

        const existingCredentials = await credentialsDb.findByUserId(user.id);
        if (existingCredentials && existingCredentials.length < 1) {
            response.statusCode = 404;
            response.message = `Account ${email} found but no password set. Please reset password.`;
            return response;
        }
        const credential = existingCredentials[0];


        if (!hashing.passwordsMatch(password, credential.pHash)) {
            response.statusCode = 422;
            response.message = "Wrong password";
            return response;
        }



        response.statusCode = 200; // created
        response.message = "Successfully logged in";
        response.cookies = {userId: user.id}; // key-values to be converted in to cookies
        return response;
    }
}