export function makeTrackingSessionsDb ({ TrackingSessionModel }) {
    const collectionName = "trackingsessions";

    async function findById(id) {
        return await TrackingSessionModel.findById(id);
    }

    async function findByTrackingCode(trackingCode) {
        return await TrackingSessionModel.findByTrackingCode(trackingCode);
    }

    async function findBetweenTimesForUser(start, end, userId) {
        return await TrackingSessionModel.findBetweenTimesForUser(start, end, userId);
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
            let updateRes = await TrackingSessionModel.updateOne({_id: trackingSession._id}, {forceStoppedAt: trackingSession.forceStoppedAt});
            // console.log("After update ", updateRes);
            return {httpStatus: 201, message: "Tracking session updated"}
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
        findByTrackingCode,
        findBetweenTimesForUser,
        insert,
        update,
        remove
    });
}