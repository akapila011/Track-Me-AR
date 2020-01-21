export function makeUsersTempDb ({ dbClient, TempUserModel }) {

    async function findById (id) {
        return TempUserModel.findById(id);
    }

    async function findByCode (code) {
        return await TempUserModel.findByCode(code)
    }

    async function findByIdOrEmail (id, email) {
        return await TempUserModel.findByIdOrEmail(id, email);
    }

    async function insert (tempUser) {
        try {
            // console.log("IN TRY");
            let user = new TempUserModel(tempUser);
            let saveRes = await user.save();
            // console.log("After save ", saveRes);
            return {httpStatus: 201, message: "User has been saved pending verification."};
        } catch (err) {
            // console.error("in my werr", err);
            return {httpStatus: 500, message: "Could not save at this time. " + err.message};
        }
    }

    async function update (tempUser) {
        try {
            let updateRes = await TempUserModel.updateOne(tempUser);
            // console.log("After update ", updateRes);
            return {httpStatus: 200, message: "Registration already exists. Verification code has been reset"}
        } catch (err) {
            // console.error("in my werr", err);
            return {httpStatus: 500, message: "Could not update the record verification code at this time"}
        }
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