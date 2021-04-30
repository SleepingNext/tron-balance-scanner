const mongoose = require("mongoose");

const AddressToBeSyncedSchema = new mongoose.Schema({
    address: { type: String }, assetId: { type: String }, balance: { type: Number },
});

AddressToBeSyncedSchema.index({ address: 1, assetId: 1 }, { unique: true });

module.exports = mongoose.model('AddressToBeSynced', AddressToBeSyncedSchema, 'AddressToBeSynced');