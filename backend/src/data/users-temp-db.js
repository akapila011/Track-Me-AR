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
        let result = {};
        console.log("Got in insert");
        //     await TempUserModel.create(tempUser, function(err, user) {
        //     if (err) {
        //         console.error(err);
        //         result = {httpStatus: 500, message: "Could not save at this time. " + err.message};
        //     } else {
        //         console.log("USER ", user);
        //         result = {httpStatus: 201, message: "User has been saved pending verification."};
        //     }
        // });
        // const y = await TempUserModel.create(tempUser);
        // console.log(y);
        // console.log("Leaving with ", result);
        // return {result, tempUser};


        try {
            console.log("IN TRY");
            let user = new TempUserModel(tempUser);
            let saveRes = await user.save();
            console.log("After save ", saveRes);
            return {httpStatus: 201, message: "User has been saved pending verification."};
        } catch (err) {
            console.error("in my werr", err);
            return {httpStatus: 500, message: "Could not save at this time. " + err.message};
        }
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