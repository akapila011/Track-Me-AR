import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id:  {type: String, required: true, unique: true, index: true},
    firstName: {type: String, required: true},
    lastName:   {type: String, required: false},
    email: {type: String, required: true, unique: true},
    dateCreated: { type: Date, default: Date.now }
});

// Virtuals
UserSchema.virtual('name').get(function () {
    return this.firstName + ' ' + this.lastName;
});

// Queries
UserSchema.statics = {
    async findById(id) {
        return await this.find({id: id});
    },

    async findByIdOrEmail(id, email) {
        return await this.find({$or: [{id: id}, {email: email}]}).exec();
    },

    async findByEmail(email) {
        return await this.find({email: email}).limit(1).exec();
    },

};


export const UserModel = mongoose.model('User', UserSchema);