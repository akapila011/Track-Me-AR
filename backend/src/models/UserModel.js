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
UserSchema.statics.findById = function(id) {
    return this.find({ id: id });
};

UserSchema.statics.findByIdOrEmail = function(id, email) {
    return this.query.or([{id: id}, {email: email}]) ;
};

export const UserModel = mongoose.model('User', UserSchema);