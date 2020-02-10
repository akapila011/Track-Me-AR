export function makeLocationDb ({ LocationModel }) {
    const collectionName = "locations";

    async function findById(_id) {
        return await LocationModel.findById(_id);
    }

    async function findByTrackingId(trackingId) {
        return await LocationModel.findByTrackingId(trackingId);
    }

    async function insert (location) {
        try {
            let saveRes = await LocationModel.create(location);
            return {httpStatus: 200, message: "Location has been recorded."};
        } catch (err) {
            // console.error("in my werr", err);
            return {httpStatus: 500, message: "Could not save at this time. " + err.message};
        }
    }

    async function remove (location) {
        const result = await LocationModel.deleteOne(location);
        return {result, location: location};
    }

    return Object.freeze({
        findById,
        findByTrackingId,
        insert,
        remove
    });
}