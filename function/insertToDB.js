const { AddressToBeSynced } = require("../model");

module.exports = async function insertToDB(addressToBeSynced, assetId, balance) {
    console.log("Hay");
    if (!(await AddressToBeSynced.findOne({ address: addressToBeSynced, assetId: assetId }))) {
        await AddressToBeSynced.create({
            address: address.address, assetId: assetId, balance: balance,
        });
    }
}