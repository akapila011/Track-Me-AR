import mongoose from 'mongoose';
import {addSecondsToDate} from "../util/util";
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

// Instance methods
TrackingSessionSchema.methods.isFinished = function(date) {
    return this.forceStoppedAt != null ||
        date > addSecondsToDate(this.endTime, this.updateInterval)

};

// Queries
TrackingSessionSchema.statics = {
    async findById(id) {
        return await this.find({id: id}).limit(1).exec();
    },
    async findByTrackingCode(trackingCode) {
        return await this.find({trackingCode: trackingCode}).limit(1).exec();
    },
    async findByDateUser(date, userId) {
        return await this.find({startTime: date, userId: userId}).exec();
    }

};


export const TrackingSessionModel = mongoose.model('TrackingSession', TrackingSessionSchema);