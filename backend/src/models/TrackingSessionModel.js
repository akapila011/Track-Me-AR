import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TrackingSessionSchema = new Schema({
    id:  {type: String, required: true, unique: true, index: true},
    trackingCode:  {type: String, required: true, unique: true, index: true},
    trackingSecret:  {type: String, required: false,},
    userId: {type: String},
    startTime:   {type: Date, required: true},
    endTime:   {type: Date, required: true},
    updateInterval: {type: Number, required: true},
    forceStoppedAt: { type: Date, required: false }
});

// Virtuals
// TrackingSessionSchema.virtual('loc').get(function () {
//     return this.latitude + ', ' + this.longitude;
// });

// Queries
TrackingSessionSchema.statics = {
    async findById(id) {
        return await this.find({id: id}).limit(1).exec();
    },
    async findByTrackingCode(trackingCode) {
        return await this.find({trackingCode: trackingCode}).limit(1).exec();
    }
};


export const TrackingSessionModel = mongoose.model('TrackingSession', TrackingSessionSchema);