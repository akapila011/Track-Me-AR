export function makeUsersDb ({ dbClient }) {
    return Object.freeze({
        // findAll,
        // findByHash,
        findById,
        findByIdOrEmail,
        // findByPostId,
        // findReplies,
        insert,
        remove,
        update
    });
    // async function findAll ({ publishedOnly = true } = {}) {
    //     // const db = await dbClient();
    //     // const query = publishedOnly ? { published: true } : {}
    //     // const result = await db.collection('comments').find(query)
    //     // return (await result.toArray()).map(({ _id: id, ...found }) => ({
    //     //     id,
    //     //     ...found
    //     // }))
    // }
    async function findById (id) {
        const db = await dbClient();
        const result = await db.collection('users').find({ id });
        const found = await result.toArray();
        if (found.length === 0) {
            return null
        }
        const { id: id, ...info } = found[0];
        return { id, ...info };
    }
    async function findByIdOrEmail (id, email) {
        const db = await dbClient();
        const result = await db.collection('users').find({ id, email });
        const found = await result.toArray();
        if (found.length === 0) {
            return null
        }
        const { id: id, ...info } = found[0];
        return { id, ...info };
    }
    // async function findByPostId ({ postId, omitReplies = true }) {
    //     const db = await dbClient()
    //     const query = { postId: postId }
    //     if (omitReplies) {
    //         query.replyToId = null
    //     }
    //     const result = await db.collection('comments').find(query)
    //     return (await result.toArray()).map(({ _id: id, ...found }) => ({
    //         id,
    //         ...found
    //     }))
    // }
    // async function findReplies ({ commentId, publishedOnly = true }) {
    //     const db = await dbClient()
    //     const query = publishedOnly
    //         ? { published: true, replyToId: commentId }
    //         : { replyToId: commentId }
    //     const result = await db.collection('comments').find(query)
    //     return (await result.toArray()).map(({ _id: id, ...found }) => ({
    //         id,
    //         ...found
    //     }))
    // }
    async function insert ({ id: _id = Id.makeId(), ...commentInfo }) {
        const db = await dbClient()
        const result = await db
            .collection('users')
            .insertOne({ _id, ...commentInfo })
        const { _id: id, ...insertedInfo } = result.ops[0]
        return { id, ...insertedInfo }
    }

    async function update ({ id: _id, ...commentInfo }) {
        const db = await dbClient()
        const result = await db
            .collection('users')
            .updateOne({ _id }, { $set: { ...commentInfo } })
        return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null
    }
    async function remove ({ id: _id }) {
        const db = await dbClient()
        const result = await db.collection('users').deleteOne({ _id })
        return result.deletedCount
    }
    async function findByHash (comment) {
        const db = await dbClient()
        const result = await db.collection('users').find({ hash: comment.hash })
        const found = await result.toArray()
        if (found.length === 0) {
            return null
        }
        const { _id: id, ...insertedInfo } = found[0]
        return { id, ...insertedInfo }
    }
}