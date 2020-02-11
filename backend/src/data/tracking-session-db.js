export function makeTrackingSessionsDb ({ TrackingSessionModel }) {
    const collectionName = "trackingsessions";

    async function findById(id) {
        return await TrackingSessionModel.findById(id).exec();
    }

    async function insert (trackingSession) {
        try {
            let saveRes = await TrackingSessionModel.create(trackingSession);
            return {httpStatus: 200, message: "Tracking session has been created.", trackingSession: saveRes};
        } catch (err) {
            // console.error("in my werr", err);
            return {httpStatus: 500, message: "Could not save at this time. " + err.message};
        }
    }

    async function update (trackingSession) {
        try {
            let updateRes = await TrackingSessionModel.updateOne(trackingSession);
            // console.log("After update ", updateRes);
            return {httpStatus: 200, message: "Tracking session updated"}
        } catch (err) {
            // console.error("in my werr", err);
            return {httpStatus: 500, message: "Could not update the tracking session"}
        }
    }

    async function remove (trackingSession) {
        const result = await TrackingSessionModel.deleteOne(trackingSession);
        return {result, location: trackingSession};
    }

    return Object.freeze({
        findById,
        insert,
        update,
        remove
    });
}