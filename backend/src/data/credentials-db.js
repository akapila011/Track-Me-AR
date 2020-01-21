export function makeCredentialsDb ({ dbClient, CredentialModel }) {
    const collectionName = "credentials";

    async function findByUserId (userId) {
        CredentialModel.findByUserId(userId);
    }
    async function insert (credential) {
        try {
            let saveRes = await CredentialModel.create(credential);
            return {httpStatus: 200, message: "Credential created."};
        } catch (err) {
            // console.error("in my werr", err);
            return {httpStatus: 500, message: "Could not save credential at this time. " + err.message};
        }
    }

    async function update (credential) {
        const result = await CredentialModel.updateOne(credential);
        return {result, credential};
    }
    async function remove (credential) {
        const result = await CredentialModel.deleteOne(credential);
        return {result, credential};
    }
    
    return Object.freeze({
        findByUserId,
        insert,
        remove,
        update
    });
}