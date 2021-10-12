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
const firstStart = 1633695609


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

        it('Authorize Oracle Token', async () => {
            await token.approve(oracle.address, "560000000");
        })
        it("Deposit Tokens in Oracle Contract2", async () => {
            await oracle.depositTokens("560000000", {from: accounts[0]});
        })
    })

    describe("set up contract for taking bets", async () => {

      it('checkHour', async () => {
        _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
        _date = new Date(1000 * _timestamp  + offset);
        console.log(`time is ${_timestamp}`);
        _hour = _date.getHours();
           if (_hour < 10) {
           await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
       }
       })

       it('send init', async () => {
            var nextStart = firstStart + 7*86400;
            console.log(`time is ${nextStart}`);
            //var nextStart = firstStart;
            //console.log(`startTime is ${nextStart}`);
            //console.log(`time is ${_timestamp}`);
            await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
        })

        it("approve and send to betting contract", async () => {
            //await helper.advanceTimeAndBlock(secondsInHour * 6);
            await oracle.initProcess();
            const startNow = await betting.betData(5);
            console.log(`startTime is ${startNow}`);
            const bookpool = await betting.margin(0);
            console.log(`startTime is ${bookpool}`);
        })

        it("Fund Contract", async () => {
        //  console.log(`startTime is ${nextStart}`);
        _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
        //const checkO = await betting.matches[0](contractHash3);
          console.log(`currTime is ${_timestamp}`);
          //const startNow = await betting.betData(5)(0);
          //console.log(`startTime is ${startNow}`);
            await betting.fundBook({ from: accounts[0], value: '30000000000000000000' });
            await betting.fundBettor({ from: accounts[2], value: '10000000000000000000' });
            await betting.fundBettor({ from: accounts[3], value: '10000000000000000000' });
            const excessCapital = await betting.margin(0);
            console.log(`margin0 is ${excessCapital} szabo`);
          })

        let contractHash0 = 0;
        it("Fail: Excess Amount Should Fail because max size is ~60 (300/5), and the bet size is ", async () => {
            const result = await betting.takeRegularBet(0, 0, "1000", { from: accounts[2]});
            contractHash1 = result.logs[0].args.contractHash;
        })

        it("bet 20 on 0:1", async () => {
            await betting.takeRegularBet(0, 1, "2000", { from: accounts[3]});
        })

        it("bet 10 on 0:1", async () => {
            await betting.takeRegularBet(0, 0, "1000", { from: accounts[2]});
        })

        it("bet 10 on 1:0", async () => {
            await betting.takeRegularBet(1, 0, "1000", { from: accounts[2]});
        })

        it("bet 20 on 1:1", async () => {
            await betting.takeRegularBet(1, 1, "2000", { from: accounts[3]});
        })

        it("bet 10 on 1:0", async () => {
            await betting.takeRegularBet(1, 0, "1000", { from: accounts[2]});
        })

        it("bet 10 on 2:0", async () => {
            await betting.takeRegularBet(2, 0, "1000", { from: accounts[2]});
        })

        it("bet 20 on 2:1", async () => {
            await betting.takeRegularBet(2, 1, "2000", { from: accounts[3]});
        })

        it("bet 10 on 2:0", async () => {
            await betting.takeRegularBet(2, 0, "1000", { from: accounts[2]});
        })

        it("bet 10 on 3:0", async () => {
            await betting.takeRegularBet(3, 0,"1000", { from: accounts[2]});
        })

        it("bet 10 on 3:0", async () => {
            await betting.takeRegularBet(3, 0, "1000", { from: accounts[2]});
        })

        it("bet 10 on 3:1", async () => {
            await betting.takeRegularBet(3, 1, "1000", { from: accounts[3]});
        })

        it("Test 1", async () => {
           const bookiePool = await betting.margin(0);
           const bettorLocked = await betting.margin(2);
           const bookieLocked = await betting.margin(1);
           const oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "finney");
           const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
           console.log(`bookiePool ${bookiePool}`);
           console.log(`bettorLocked ${bettorLocked}`);
           console.log(`bookieLocked ${bookieLocked}`);
           console.log(`oracleBal ${oracleBal}`);
           console.log(`ethbal ${ethbal}`);
            })

        it('checkHour', async () => {
          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          _date = new Date(1000 * _timestamp  + offset);
          console.log(`ts0 = ${_timestamp}`);
          _hour = _date.getHours();
          console.log(`hour = ${_hour}`);
             if (_hour < 10) {
             await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
         }
         })

        it("Send Event Results to oracle", async () => {
            await
            oracle.settlePost([0,0,2,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        });

/*
        it("bettorBalances", async () => {
          const userBalanceAcct2 = await betting.userBalance(accounts[2]);
          const userBalanceAcct3 = await betting.userBalance(accounts[3]);
          console.log(`acct2 ${userBalanceAcct2}`);
          console.log(`acct3 ${userBalanceAcct3}`);
        })
*/
        it("send result data to betting contract", async () => {
            await helper.advanceTimeAndBlock(secondsInHour * 6);
            await oracle.settleProcess();
        });

          it("Test 2", async () => {
            const bookiePool = await betting.margin(0);
            const bettorLocked = await betting.margin(2);
            const bookieLocked = await betting.margin(1);
            const oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "finney");
            const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
            console.log(`bookiePool ${bookiePool}`);
            console.log(`bettorLocked ${bettorLocked}`);
            console.log(`bookieLocked ${bookieLocked}`);
            console.log(`oracleBal ${oracleBal}`);
            console.log(`bettingk balance ${ethbal}`);
          })
/*
          it("bettorBalances", async () => {
            await betting.redeem(contractHash1, { from: accounts[2] });
            const userBalanceAcct2 = await betting.userBalance(accounts[2]);
            console.log(`acct2 ${userBalanceAcct2}`);
          })
*/

  })


})
