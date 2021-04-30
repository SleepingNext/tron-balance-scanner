const { AddressToBeSynced } = require("../model");
const BigNumber = require("bignumber.js");

module.exports = async function sumBalance(assetId) {
    const addressesToBeSynced = await AddressToBeSynced.find({ assetId: assetId });
    let balance = new BigNumber(0);

    for (const addressToBeSynced of addressesToBeSynced) balance = balance.plus(new BigNumber(addressToBeSynced.balance));

    console.log(balance.toFixed());
}