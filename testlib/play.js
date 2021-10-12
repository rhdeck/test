const Betting = artifacts.require("Betting");
const Token = artifacts.require("Token");
const Oracle = artifacts.require("Oracle");
const Web3 = require("web3");
const connectionString = "http://localhost:8545";
const web3 = new Web3(connectionString);
const helper = require('../helper');
require('chai').use(require('chai-as-promised')).should();


contract('Betting', function (accounts) {
    let betting, oracle, token;

    before(async () => {
        betting = await Betting.deployed();
        oracle = await Oracle.deployed();
        token = await Token.deployed();
    })


    describe("testdat", async () => {

       it('send init', async () => {
            await betting.populate(1, 2);
        })

        it("Fund Contract", async () => {
            const testSx = (await betting.testStruct()).x;
            const testSy = (await betting.testStruct()).y;
            const lpStructshare = (await betting.lpStruct(1)).shares;
            const lpStructepoch = (await betting.lpStruct(1)).epoch;
            console.log(`testSx is ${testSx} gwei`);
            console.log(`testSy is ${testSy} gwei`);
            console.log(`lpStructshare is ${lpStructshare} gwei`);
            console.log(`lpStructepoch is ${lpStructepoch} gwei`);
          })
    })



})
