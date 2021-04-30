const balance1 = require("./function/balance1and2");
const sumBalance = require("./function/sumBalance");
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/trx_mainnet", {useUnifiedTopology: true, useNewUrlParser: true});

const app = express();

app.get('/balance1', async function (req, res) {
    balance1();
    res.send("Successfully called balance1().");
});

app.get('/sum-balance', async function (req, res) {
    sumBalance(req.query.assetId);
    res.send("Successfully called sumBalance().");
});

app.get('/ping', function (req, res) {
    res.send("Pong.");
});

mongoose.connection.once("open", async function () {
    const server = app.listen(process.env.PORT || 3000, function () {
        console.log("Listening on port", server.address().port);
    });
});