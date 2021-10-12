const Betting = artifacts.require("Betting");
const Token = artifacts.require("Token");
const Oracle = artifacts.require("Oracle");
const Web3 = require("web3");
const connectionString = "http://localhost:8545";
const web3 = new Web3(connectionString);
const helper = require('../helper');
const secondsInHour = 3600;
_dateo = new Date();
const offset = _dateo.getTimezoneOffset() * 60  * 1000 - 7200000;
var _timestamp;
var _date;
var _hour;
var _hourk;
var _date0;


require('chai').use(require('chai-as-promised')).should();

contract('Betting', function (accounts) {
    let betting, oracle, token;

    before(async () => {
        betting = await Betting.deployed();
        oracle = await Oracle.deployed();
        token = await Token.deployed();
    })

    describe("set up contract", async () => {



      it('Get Oracle Contract Address', async () => {
          console.log(`Oracle Address is ${oracle.address}`);
      })

        it('Send Betting/Oracle contract to Token', async () => {
            await token.proposeContract(betting.address, oracle.address);
        })

        it('Finalize Betting/Oracle contract to Token', async () => {
            await token.processVote();
        })

        it('Authorize Oracle Token', async () => {
            _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
            console.log(`ts0 = ${_timestamp}`);});
            var nextStart = firstStart + 7*86400;
            await helper.advanceTimeAndBlock(nextStart - _timestamp);
            _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
            console.log(`ts1 = ${_timestamp}`);});


    })

    describe("set up contract for taking bets", async () => {

      it('checkHour', async () => {
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          await helper.advanceTimeAndBlock(1620086405 - _timestamp);
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date0 = new Date(1000 * _timestamp);
          _hour = _date0.getHours();
          _hourk = await oracle.hourOfDay();
          console.log(`ts0 = ${_timestamp}`);
          console.log(`hour0 = ${_hour}`);
          console.log(`hourk = ${_hourk}`);


          await helper.advanceTimeAndBlock(1620090005 - _timestamp);
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date0 = new Date(1000 * _timestamp);
          _hour = _date0.getHours();
          _hourk = await oracle.hourOfDay();
          console.log(`ts0 = ${_timestamp}`);
          console.log(`hour0 = ${_hour}`);
          console.log(`hourk = ${_hourk}`);

          await helper.advanceTimeAndBlock(1620093605 - _timestamp);
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date0 = new Date(1000 * _timestamp);
          _hour = _date0.getHours();
          _hourk = await oracle.hourOfDay();
          console.log(`ts0 = ${_timestamp}`);
          console.log(`hour0 = ${_hour}`);
          console.log(`hourk = ${_hourk}`);

          await helper.advanceTimeAndBlock(1620097205 - _timestamp);
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date0 = new Date(1000 * _timestamp);
          _hour = _date0.getHours();
          _hourk = await oracle.hourOfDay();
          console.log(`ts0 = ${_timestamp}`);
          console.log(`hour0 = ${_hour}`);
          console.log(`hourk = ${_hourk}`);

          await helper.advanceTimeAndBlock(1620100805 - _timestamp);
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date0 = new Date(1000 * _timestamp);
          _hour = _date0.getHours();
          _hourk = await oracle.hourOfDay();
          console.log(`ts0 = ${_timestamp}`);
          console.log(`hour0 = ${_hour}`);
          console.log(`hourk = ${_hourk}`);

          await helper.advanceTimeAndBlock(1620104405 - _timestamp);
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date0 = new Date(1000 * _timestamp);
          _hour = _date0.getHours();
          _hourk = await oracle.hourOfDay();
          console.log(`ts0 = ${_timestamp}`);
          console.log(`hour0 = ${_hour}`);
          console.log(`hourk = ${_hourk}`);

          await helper.advanceTimeAndBlock(162010805 - _timestamp);
        _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
        _date0 = new Date(1000 * _timestamp);
        _hour = _date0.getHours();
        _hourk = await oracle.hourOfDay();
        console.log(`ts0 = ${_timestamp}`);
        console.log(`hour0 = ${_hour}`);
        console.log(`hourk = ${_hourk}`);
        /*
        _date = new Date(1000 * _timestamp  + offset);
        _hour = _date.getHours();
        _hourk = await oracle.hourOfDay();
        console.log(`ts1 = ${_timestamp}`);
        console.log(`hour1 = ${_hour}`);
        console.log(`hourk = ${_hourk}`);
           if (_hour < 10) {
           await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
       }
       _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
       _date0 = new Date(1000 * _timestamp);
       _hour = _date0.getHours();
       _hourk = await oracle.hourOfDay();
       console.log(`ts0 = ${_timestamp}`);
       console.log(`hour0 = ${_hour}`);
       console.log(`hourk = ${_hourk}`);
       })
    });



})
