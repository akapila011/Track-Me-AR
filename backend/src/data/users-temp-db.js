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
        // const dbresult = await TempUserModel.updateOne(tempUser);
        // let result = {};
        // if (dbresult.ok === 1) {
        //     result = {httpStatus: 200, message: "Registration already exists. Verification code has been reset"}
        // } else {
        //     result = {httpStatus: 500, message: "Could not update the record verification code at this time"}
        // }
        try {
            let updateRes = await TempUserModel.updateOne(tempUser);
            console.log("After update ", updateRes);
            return {httpStatus: 200, message: "Registration already exists. Verification code has been reset"}
        } catch (err) {
            console.error("in my werr", err);
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