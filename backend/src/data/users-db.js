export function makeUsersDb ({UserModel}) {
    
    async function findById(id) {
        return await UserModel.findById(id);
    }

    async function findByIdOrEmail(id, email) {
        return await UserModel.findByIdOrEmail(id, email);
    }

    async function findByEmail(email) {
        return await UserModel.findByEmail(email);
    }

    async function insert (user) {
        try {
            let saveRes = await UserModel.create(user);
            return {httpStatus: 200, message: "User has been saved."};
        } catch (err) {
            // console.error("in my werr", err);
            return {httpStatus: 500, message: "Could not save at this time. " + err.message};
        }
    }

    async function update (user) {
        const result = await UserModel.updateOne(user);
        return {result, user};
    }
    async function remove (user) {
        const result = await UserModel.deleteOne(user);
        return {result, user};
    }
    return Object.freeze({
        findById,
        findByIdOrEmail,
        findByEmail,
        insert,
        remove,
        update
    });
}