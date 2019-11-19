import createUser from "../entities/User";

export function makeSaveUser({usersDb}) {
    return async function saveUser(userData) {
        const user = createUser(userData);

        const exists = await usersDb.findByIdOrEmail(user.getId(), user.getEmail()); // both fields must be unique
        if (exists) {  // TODO: should already exists be an error, can be used to let user know they already exist
            return exists;
        }

        return usersDb.insert({
            id: user.getId(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            dateCreated: user.getDateCreated()
        });
    }
}