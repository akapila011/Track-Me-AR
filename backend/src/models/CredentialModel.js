import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CredentialSchema = new Schema({
    userId:  {type: String, required: true, unique: true, index: true},
    salt: {type: String, required: true},
    pHash:   {type: String, required: false},
});

// Queries

CredentialSchema.statics = {
    async findByUserId(userId) {
        return await this.find({userId: userId}).limit(1).exec();
    },
};


export const CredentialModel = mongoose.model('Credential', CredentialSchema);