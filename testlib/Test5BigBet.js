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
const firstStart = 1633695609;



require('chai').use(require('chai-as-promised')).should();

contract('Betting', function (accounts) {
    let betting, oracle, token;

    before(async () => {
        betting = await Betting.deployed();
        oracle = await Oracle.deployed();
        token = await Token.deployed();
    })

    describe('Oracle', async () => {

        it('Authorize Oracle Token', async () => {
            await token.approve(oracle.address, "560000000", {from: accounts[0]});
        })

        it("Deposit Tokens in Oracle Contract", async () => {
            await oracle.depositTokens("560000000", {from: accounts[0]});
        })
    });


    describe("set up contract for taking bets", async () => {

      it('checkHour', async () => {
        _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
        _date = new Date(1000 * _timestamp  + offset);
        _hour = _date.getHours();
           if (_hour < 10) {
           await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
       }
       })

        it("send initial data", async () => {
            var nextStart = firstStart + 7*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [827, 955, 1000, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
        })

        it('fast forward 4 hours', async () => {
       await helper.advanceTimeAndBlock(secondsInHour * 6);
       })

        it("approve and send to betting contract", async () => {
            await oracle.initProcess();
        })

        it("Fund Betting Contract", async () => {
            await betting.fundBook({ from: accounts[0], value: '1000000000000000000' });
        })

        it("Fund Betting Contract with 200 finney", async () => {
            await betting.fundBettor({ from: accounts[2], value: '1000000000000000000' });
        })

        it("Fund Betting Contract with 200 finney", async () => {
            await betting.fundBettor({ from: accounts[3], value: '1000000000000000000' });
        })

        it("Fund Betting Contract with 200 finney", async () => {
        const userBalanceAcct0 = (await betting.lpStruct(accounts[0])).shares;
        const userBalanceAcct2 = await betting.userBalance(accounts[2]);
        const userBalanceAcct3 = await betting.userBalance(accounts[3]);
        console.log(`acct0 ${userBalanceAcct0}`);
        console.log(`acct2 ${userBalanceAcct2}`);
        console.log(`acct3 ${userBalanceAcct3}`);
        })

    });

    describe("Send  Bets", async () => {

        let contractHash0;

        it("bet 10 on 0:0 (match 0: team 0)", async () => {
            const result = await betting.takeRegularBet(0, 0, "1000",{ from: accounts[3]});
            contractHash0 = result.logs[0].args.contractHash;
        })

        let contractHash1;
        it("bet 10 on 0:1", async () => {
            const result2 = await betting.takeRegularBet(0, 1, "1000",  { from: accounts[2]});
            contractHash1 = result2.logs[0].args.contractHash;
        })

       let contractHash2;
        it("bet 10 on 2:1 (match 2: team 1)", async () => {
            const result = await betting.takeRegularBet(2, 1, "1000", { from: accounts[2]});
            contractHash2 = result.logs[0].args.contractHash;
        })

        let contractHash3;
        it("Offer Big Bet for 100 on 3:0", async () => {
            const result3 = await betting.postBigBet(3, 0, 3000, 2000, { from: accounts[2] });
            contractHash3 = result3.logs[0].args.contractHash;
            const gasUsed = result3.receipt.gasUsed;
            console.log(`gas on big bet ${gasUsed}`);
            const check0 = await betting.checkRedeem(contractHash3,1030);
            const check1 = (await betting.subcontracts(contractHash3)).betAmount;
            console.log(`checkOfferFn ${check0}`);
            console.log(`checkOfferGetter ${check1}`);

        })

        let contractHash4;
        it("take above Big Bet, putting 95.5 on 1:1", async () => {
            const result4 = await betting.takeBigBet(contractHash3, { from: accounts[3] });
            const gasUsed = result4.receipt.gasUsed;
            console.log(`gas on taking big bet ${gasUsed}`);
            contractHash4 = result4.logs[1].args.contractHash;
            const pick2 = result4.logs[0].args.pick;
            console.log(`pick2 ${pick2}`);
            const pick3 = result4.logs[1].args.pick;
            console.log(`pick3 ${pick3}`);
        })

        let contractHash5;
        it("Offer Big Bet for 100 on 1:0", async () => {
            const result = await betting.postBigBet(3, 0, "3000", 2000, { from: accounts[2] });
            const gasUsed = result.receipt.gasUsed;
            console.log(`gas on second offered big bet ${gasUsed}`);
            contractHash5 = result.logs[0].args.contractHash;
        })

        it("State Variables in Betting Contract before settle", async () => {
          const bookiePool = await betting.margin(0);
          const bettorLocked = await betting.margin(2);
          const bookieLocked = await betting.margin(1);
          const oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "finney");
          const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
          const userBalanceAcct2 = await betting.userBalance(accounts[2]);
          const userBalanceAcct3 = await betting.userBalance(accounts[3]);
          console.log(`acct2 ${userBalanceAcct2}`);
          console.log(`acct3 ${userBalanceAcct3}`);
          console.log(`bookiePool ${bookiePool}`);
          console.log(`bettorLocked ${bettorLocked}`);
          console.log(`bookieLocked ${bookieLocked}`);
          console.log(`oracleBal ${oracleBal}`);
          console.log(`ethbal ${ethbal}`);

/*
           assert.equal(excessCapital, "89.88", "Must be equal");
            assert.equal(marginedCapital, "10.12", "Must be equal");
            assert.equal(betCapital, "220.9", "Must be equal");
            assert.equal(redeemPot, "0", "Must be equal");
            assert.equal(userFunds, "3679.1", "Must be equal");
            assert.equal(ethbal, "4100", "Must be equal");
            assert.equal(oracleBal, "0", "Must be equal");
            assert.equal(bbalance, "100", "Must be equal");
            assert.equal(userBalanceAcct2, "1780", "Must be equal");
            assert.equal(userBalanceAcct3, "1899.1", "Must be equal");*/
        })

        it("bumpTime", async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              await helper.advanceTimeAndBlock(86400);
        });

        it('checkHour', async () => {
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date = new Date(1000 * _timestamp  + offset);
          _hour = _date.getHours();
             if (_hour < 10) {
             await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
         }
         })

        it("Send Event Results to oracle", async () => {
            await
            oracle.settlePost([1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        })

        it('fast forward 4 hours', async () => {
       await helper.advanceTimeAndBlock(secondsInHour * 6);
       })

        it("send result data to betting contract", async () => {
            await oracle.settleProcess();
        })

        it("State Variables in Betting Contract after settle", async () => {
          const bookiePool = await betting.margin(0);
          const bettorLocked = await betting.margin(2);
          const bookieLocked = await betting.margin(1);
          const oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "finney");
          const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
          const userBalanceAcct2 = await betting.userBalance(accounts[2]);
          const userBalanceAcct3 = await betting.userBalance(accounts[3]);
          console.log(`acct2 ${userBalanceAcct2}`);
          console.log(`acct3 ${userBalanceAcct3}`);
          console.log(`bookiePool ${bookiePool}`);
          console.log(`bettorLocked ${bettorLocked}`);
          console.log(`bookieLocked ${bookieLocked}`);
          console.log(`oracleBal ${oracleBal}`);
          console.log(`ethbal ${ethbal}`);


/*
           assert.equal(excessCapital, "89.88", "Must be equal");
           assert.equal(marginedCapital, "0", "Must be equal");
            assert.equal(betCapital, "0", "Must be equal");
            assert.equal(redeemPot, "225.014", "Must be equal");
            assert.equal(userFunds, "3679.1", "Must be equal");
            assert.equal(ethbal, "4093.994", "Must be equal");
            assert.equal(oracleBal, "6.006", "Must be equal");
            assert.equal(bbalance, "100", "Must be equal");
            assert.equal(userBalanceAcct2, "1780", "Must be equal");
            assert.equal(userBalanceAcct3, "1899.1", "Must be equal");*/
        })

        it("redeem  bet on 0:1 ", async () => {
          const result = await betting.redeem(contractHash1, 1001, { from: accounts[2] });
          const gasUsed = result.receipt.gasUsed;
          console.log(`gas on redeem bet ${gasUsed}`);
        })

        it("redeem  bet on 2:1 ", async () => {
          const result = await betting.redeem(contractHash2, 1021, { from: accounts[2] });
          const gasUsed = result.receipt.gasUsed;
          console.log(`gas on redeem second bet ${gasUsed}`);
        })

        it("redeem  Bigbet on 1:1 ", async () => {
          const result = await betting.redeem(contractHash4, 1011, { from: accounts[3] });
          //const payout = web3.utils.fromWei(result.logs[0].args.etherCredit, "finney");
          //console.log(`odds 1.909 on opponent, so 2.100 on this bet`);
          //console.log(`because 1e6/827  = 1100 `);
          //console.log(`1.11*100*0.95 + 100= 185.9= ${payout}`);
        })

        it("refund big bet not taken", async () => {
          const result = await betting.cancelBigBet(contractHash5, { from: accounts[2] });
          //const payout = web3.utils.fromWei(result.logs[0].args.etherCredit, "finney");
          //console.log(`redemption of not taken big bet (100)= ${payout}`);
        })

        it("State Variables in Betting Contract after redemption from bettors", async () => {
          const bookiePool = await betting.margin(0);
          const bettorLocked = await betting.margin(2);
          const bookieLocked = await betting.margin(1);
          const oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "finney");
          const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
          const userBalanceAcct2 = await betting.userBalance(accounts[2]);
          const userBalanceAcct3 = await betting.userBalance(accounts[3]);
          console.log(`acct2 ${userBalanceAcct2}`);
          console.log(`acct3 ${userBalanceAcct3}`);
          console.log(`bookiePool ${bookiePool}`);
          console.log(`bettorLocked ${bettorLocked}`);
          console.log(`bookieLocked ${bookieLocked}`);
          console.log(`oracleBal ${oracleBal}`);
          console.log(`ethbal ${ethbal}`);


/*
            assert.equal(excessCapital, "89.88", "Must be equal");
            assert.equal(marginedCapital, "0", "Must be equal");
            assert.equal(betCapital, "0", "Must be equal");
            assert.equal(redeemPot, "0", "Must be equal");
            assert.equal(userFunds, "4004.114", "Must be equal");
            assert.equal(ethbal, "4093.994", "Must be equal");
            assert.equal(oracleBal, "6.006", "Must be equal");
            assert.equal(bbalance, "0", "Must be equal");
            assert.equal(userBalanceAcct2, "1919.114", "Must be equal");
            assert.equal(userBalanceAcct3, "2085", "Must be equal");*/

          })

        })


  })
