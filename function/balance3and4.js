const axios = require("axios");
const BigNumber = require("bignumber.js");
const insertToDB = require("./insertToDB");

const supportedContractAddress = []; // Fill this array with TRC20 Contract Address
const supportedTokenId = []; // Fill this array with TRC10 TokenID

async function balance3(addressesToBeChecked) {
    const tasks = [];

    for (let i = 0; i < addressesToBeChecked.length; i++) tasks.push(balance4(addressesToBeChecked[i]));

    await Promise.all(tasks);
}

async function retryBalance3(arrayOfAddressesToBeChecked, retryTimes) {
    if (retryTimes > 0) {
        try {
            await sleep(5000);
            console.log("Retry left:", retryTimes - 1);

            await Promise.all([
                balance3(arrayOfAddressesToBeChecked[0]),
                balance3(arrayOfAddressesToBeChecked[1]),
            ]);

            console.log("Successfully retried.");
        } catch (e) {
            await retryBalance3(arrayOfAddressesToBeChecked, retryTimes - 1);
        }
    } else throw new Error("Can't retry.");
}

async function balance4(addressToBeChecked) {
    const apiUrl = `https://apilist.tronscan.org/api/account?address=${addressToBeChecked}`;
    const data = (await axios.get(apiUrl)).data;
    const trxBalance = new BigNumber(data.balance);
    const trc20Balances = data.trc20token_balances;
    const tokenBalances = data.tokenBalances;

    if (trxBalance.isLessThanOrEqualTo(new BigNumber(1000000))) await insertToDB(addressToBeChecked, null, trxBalance.toFixed());

    for (let i = 0; i < trc20Balances.length; i++) {
        const tokenId = trc20Balances[i].tokenId;
        const tokenBalance = new BigNumber(trc20Balances[i].balance);
        if ((supportedContractAddress.includes(tokenId)) && tokenBalance.isLessThanOrEqualTo(new BigNumber(0))) await insertToDB(addressToBeChecked, tokenId, tokenBalance.toFixed());
    }

    for (let i = 0; i < tokenBalances.length; i++) {
        const tokenId = tokenBalances[i].tokenId;
        const tokenBalance = new BigNumber(tokenBalances[i].balance);
        if ((supportedTokenId.includes(tokenId)) && tokenBalance.isLessThanOrEqualTo(new BigNumber(0))) await insertToDB(addressToBeChecked, tokenId, tokenBalance.toFixed());
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { balance3, retryBalance3 };