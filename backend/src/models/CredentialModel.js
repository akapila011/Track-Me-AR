import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CredentialSchema = new Schema({
    userId:  {type: String, required: true, unique: true, index: true},
    salt: {type: String, required: true},
    pHash:   {type: String, required: false},
});

// Queries
CredentialSchema.statics.findByUserId = function(userId) {
    return this.find({ userId: userId });
};


export const CredentialModel = mongoose.model('Credential', CredentialSchema);