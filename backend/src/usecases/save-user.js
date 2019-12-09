import createUser from "../entities/User";

export function makeSaveUser({usersTempDb}) {
    return async function saveUser(userData) {
        const user = createUser(userData);
        const response = {
            statusCode: 500,
            message: "Unknown Error: Check Logs"
        };

        const exists = await usersTempDb.findByIdOrEmail(user.getId(), user.getEmail()); // both fields must be unique
        if (exists) {  // TODO: should already exists be an error, can be used to let user know they already exist
            response.statusCode = 409; // conflict
            response.message = "User already exists";
            return response;
        }

        usersTempDb.insert({
            id: user.getId(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            dateCreated: user.getDateCreated(),
            verificationCode: "",
        });

        response.statusCode = 201; // created
        response.message = "User has been saved";
        return response;
    }
}