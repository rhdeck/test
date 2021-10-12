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

    describe('Preliminaries', async () => {
        it('Get Oracle Contract Address', async () => {
            console.log(`Oracle Address is ${oracle.address}`);
        })

        it('Authorize Oracle Token', async () => {
            await token.approve(oracle.address, "560000000");
        })

        it("Deposit Tokens in Oracle Contract", async () => {
            await oracle.depositTokens("560000000", {from: accounts[0]});
        })
    })

    describe("setupBets", async () => {

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
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [955, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
        })

        it('fast forward 4 hours', async () => {
       await helper.advanceTimeAndBlock(secondsInHour * 6);
       })

        it("Send Initial Data", async () => {
            await oracle.initProcess();
        })

        it("approve and send to betting contract", async () => {
            await betting.fundBook({ from: accounts[0], value: '3000000000000000000' });
        })

        it("Fund Betting Contract with 200 finney", async () => {
            await betting.fundBettor({ from: accounts[1], value: '1000000000000000000' });
        })

        it("Fund Betting Contract with 200 finney", async () => {
            await betting.fundBettor({ from: accounts[2], value: '1000000000000000000' });
        })



    });

    describe("Send Bets, update Odds, send more bets", async () => {

        let contractHash1;
        it("bet 10 on 0:0 (match 0: team 0)", async () => {
            const result = await betting.takeRegularBet(0, 0, "1000", { from: accounts[1]});
            contractHash1 = result.logs[0].args.contractHash;
            1000
        })

        it('checkHour', async () => {
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date = new Date(1000 * _timestamp  + offset);
          _hour = _date.getHours();
             if (_hour < 10) {
             await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
         }
         })

        it("send updated odds data", async () => {
          var nextStart = firstStart + 7*86400;
            await oracle.updatePost([nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart],[800, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
        })

        it('fast forward 4 hours', async () => {
       _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
        await helper.advanceTimeAndBlock(secondsInHour * 6);
       })

        it("approve and send to betting contract", async () => {
            await oracle.updateProcess();
        })

        let contractHash2;
        it("bet on 0:0 after odds update", async () => {
            const result12 = await betting.takeRegularBet(0, 0, "1000", { from: accounts[2]});
            contractHash2 = result12.logs[0].args.contractHash;
        })

        it("Check State Variables before Settle", async () => {
          const bookiePool = await betting.margin(0);
          const bettorLocked = await betting.margin(2);
          const bookieLocked = await betting.margin(1);
          const oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "finney");
          const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
          const userBalanceAcct1 = await betting.userBalance(accounts[1]);
          const userBalanceAcct2 = await betting.userBalance(accounts[2]);
          console.log(`acct2 ${userBalanceAcct2}`);
          console.log(`acct3 ${userBalanceAcct2}`);
          console.log(`bookiePool ${bookiePool}`);
          console.log(`bettorLocked ${bettorLocked}`);
          console.log(`bookieLocked ${bookieLocked}`);
          console.log(`oracleBal ${oracleBal}`);
          console.log(`ethbal ${ethbal}`);

/*
            assert.equal(excessCapital, "82.45", "Must be equal");
            assert.equal(marginedCapital, "17.55", "Must be equal");
            assert.equal(betCapital, "20", "Must be equal");
            assert.equal(redeemPot, "0", "Must be equal");
            assert.equal(userFunds, "380", "Must be equal");
            assert.equal(ethbal, "500", "Must be equal");
            assert.equal(oracleBal, "0", "Must be equal");
*/
        })

        it("bumpTime", async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              await helper.advanceTimeAndBlock( 86400);
        });

        it('checkHour', async () => {
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date = new Date(1000 * _timestamp  + offset);
          _hour = _date.getHours();
             if (_hour < 10) {
             await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
         }
         })

        it("Send Event Results", async () => {
            await oracle.settlePost([0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        });

        it("Approve results and send to betting contract", async () => {
           await helper.advanceTimeAndBlock(secondsInHour * 6);
            await oracle.settleProcess();
        });



        it("bettorBalances", async () => {
          await betting.redeem(contractHash1, 1000, { from: accounts[1] });
          await betting.redeem(contractHash2, 1000, { from: accounts[2] });

        })

        it("Check State Variables in After Settle, Redemption", async () => {
          const bookiePool = await betting.margin(0);
          const bettorLocked = await betting.margin(2);
          const bookieLocked = await betting.margin(1);
          const oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "finney");
          const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
          const userBalanceAcct1 = await betting.userBalance(accounts[1]);
          const userBalanceAcct2 = await betting.userBalance(accounts[2]);
          console.log(`acct1 ${userBalanceAcct1}`);
          console.log(`acct2 ${userBalanceAcct2}`);
          console.log(`bookiePool ${bookiePool}`);
          console.log(`bettorLocked ${bettorLocked}`);
          console.log(`bookieLocked ${bookieLocked}`);
          console.log(`oracleBal ${oracleBal}`);
          console.log(`ethbal ${ethbal}`);
/*
            assert.equal(excessCapital, "82.45", "Must be equal");
            assert.equal(marginedCapital, "0", "Must be equal");
            assert.equal(betCapital, "0", "Must be equal");
            assert.equal(redeemPot, "0", "Must be equal");
            assert.equal(userFunds, "416.6725", "Must be equal");
            assert.equal(ethbal, "499.1225", "Must be equal");
            assert.equal(oracleBal, "0.8775", "Must be equal");
            */
        })
    })



})
