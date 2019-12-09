export function makeCredentialsDb ({ dbClient, CredentialModel }) {
    const collectionName = "credentials";

    async function findByUserId (userId) {
        CredentialModel.findByUserId(userId);
    }
    async function insert ({ credential }) {
        const db = await dbClient();
        const result = await db
            .collection(collectionName)
            .insertOne({ credential});
        const { _id: id, ...insertedInfo } = result.ops[0];
        return { id, ...insertedInfo }
    }

    async function update ({ id: _id, ...commentInfo }) {
        const db = await dbClient()
        const result = await db
            .collection(collectionName)
            .updateOne({ _id }, { $set: { ...commentInfo } })
        return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null
    }
    async function remove (userId) {
        const db = await dbClient()
        const result = await db.collection(collectionName).deleteOne({ userId: userId })
        return result.deletedCount
    }


    return Object.freeze({
        findByUserId,
        insert,
        remove,
        update
    });
}