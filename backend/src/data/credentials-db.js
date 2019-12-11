export function makeCredentialsDb ({ dbClient, CredentialModel }) {
    const collectionName = "credentials";

    async function findByUserId (userId) {
        CredentialModel.findByUserId(userId);
    }
    async function insert (credential) {
        const result = await CredentialModel.create(credential);
        return {result, credential};
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