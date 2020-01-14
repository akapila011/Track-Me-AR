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
    findById(id) {
        return this.find({id: id});
    },

    async findByIdOrEmail(id, email) {
        let result = null;
        await this.find().and([
            {$or: [{id: id}, {email: email}]}
        ]).exec(function(err, res) {
            if (err) {
                console.error("err ", err);
                result = null;
            }
            else {
                console.log("res ", res);
                result = res;
            }
        });
        return result;
    },

};


export const UserModel = mongoose.model('User', UserSchema);