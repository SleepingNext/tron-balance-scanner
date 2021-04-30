const addresses = require("../addresses");
const { balance3, retryBalance3 } = require("./balance3and4");

let addressesToBeChecked1 = [], addressesToBeChecked2 = [], i = 0;

module.exports = async function balance1() {
    const start = new Date();

    for (i; i < addresses.length - 40; i++) await balance2();

    if (i === addresses.length - 40) for (i; i < addresses.length; i++) await balance2();
    else {
        let addressesToBeChecked = [];
        for (i; i < addresses.length; i++) {
            addressesToBeChecked.push(addresses[i]);

            if ((i + 1) % 20 === 0) {
                await balance3(addressesToBeChecked);
                addressesToBeChecked = [];
            }
        }

        if (addressesToBeChecked.length > 0) await balance3(addressesToBeChecked);
    }

    console.info('Execution time: %dms', new Date() - start);
}

async function balance2() {
    addressesToBeChecked1.push(addresses[i]);
    addressesToBeChecked2.push(addresses[i + 20]);

    if ((i + 1) % 20 === 0) {
        console.log("Progress:", i);

        try {
            await Promise.all([
                balance3(addressesToBeChecked1),
                balance3(addressesToBeChecked2),
            ]);
        } catch (e) {
            await retryBalance3([
                addressesToBeChecked1, addressesToBeChecked2
            ], 20);
        } finally {
            addressesToBeChecked1 = [];
            addressesToBeChecked2 = [];
            i += 20;
        }
    }
}