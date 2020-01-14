import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TempUserSchema = new Schema({
    id:  {type: String, required: true, index: true},
    firstName: {type: String, required: true},
    lastName:   {type: String, required: false},
    email: {type: String, required: true},
    dateCreated: { type: Date, required: true, default: Date.now },
    dateInserted: { type: Date, required: true, default: Date.now },
    expirationDate: { type: Date, required: true, default: Date.now },
    code: {type: String, required: true, unique: true}
});

// Virtuals
TempUserSchema.virtual('name').get(function () {
    return this.firstName + ' ' + this.lastName;
});

// Queries
// TempUserSchema.statics.findById = function(id) {
//     return this.find({ id: id });
// };
//
// TempUserSchema.statics.findByCode = function(code) {
//     return this.find({ code: code });
// };
//
// TempUserSchema.statics.findByIdOrEmail = function (id, email) {
//     return this.query.or([{id: id}, {email: email}]) ;
// };

TempUserSchema.statics = {
    findById(id) {
        return this.find({id: id});
    },

    findByCode(code) {
        return this.find({code: code});
    },

    async findByIdOrEmail(id, email) {
        // return this.query.or([{id: id}, {email: email}]);
        let result = null;
            await this.find({id: id}).exec(function(err, res) {
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

export const TempUserModel = mongoose.model('TempUser', TempUserSchema);