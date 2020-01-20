export function makeUsersDb ({ dbClient, UserModel }) {
    
    async function findById (id) {
        return UserModel.findById(id);
    }
    async function findByIdOrEmail (id, email) {
        return await UserModel.findByIdOrEmail(id, email)
    }

    async function insert (user) {
        const result = await UserModel.create(user);
        return {result, user};
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
        insert,
        remove,
        update
    });
}