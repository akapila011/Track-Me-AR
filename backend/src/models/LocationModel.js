import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    latitude:  {type: Number, required: true, validate: (val) => {return val >= -90 && val <= 90}},
    longitude:  {type: Number, required: true, validate: (val) => {return val >= -180 && val <= 180}},
    time: { type: Date, default: Date.now, required: true},
    trackingId: { type: String, required: true}
});

// Virtuals
LocationSchema.virtual('loc').get(function () {
    return this.latitude + ', ' + this.longitude;
});

// Queries
LocationSchema.statics = {
    async findById(_id) {
        return await this.find({_id: _id}).exec();
    },

    async findByTrackingId(trackingId) {
        return await this.find({getTrackingId: trackingId}).exec();
    },

};


export const LocationModel = mongoose.model('Location', LocationSchema);