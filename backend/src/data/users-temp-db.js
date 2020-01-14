export function makeUsersTempDb ({ dbClient, TempUserModel }) {

    async function findById (id) {
        return TempUserModel.findById(id);
    }

    async function findByCode (code) {
        return TempUserModel.findByCode(code)
    }

    async function findByIdOrEmail (id, email) {
        // return await TempUserModel.find({id: id, email: email}).exec(function(err, rec) {
        //     consoloe.log("err, rec" , err, rec);
        // });
        return await TempUserModel.findByIdOrEmail(id, email);
    }

    async function insert (tempUser) {
        const result = await TempUserModel.create(tempUser);
        return {result, tempUser};
    }

    async function update (tempUser) {
        const result = await TempUserModel.updateOne(tempUser);
        return {result, tempUser};
    }

    async function remove (tempUser) {
        const result = await TempUserModel.deleteOne(tempUser);
        return {result, tempUser};
    }

    return {
        findById,
        findByCode,
        findByIdOrEmail,
        insert,
        remove,
        update
    };
}