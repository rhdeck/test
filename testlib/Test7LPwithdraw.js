const Betting = artifacts.require("Betting");
const Token = artifacts.require("Token");
const Oracle = artifacts.require("Oracle");

const Web3 = require("web3");
const connectionString = "http://localhost:8545";
const web3 = new Web3(connectionString);
const helper = require('../helper');
const secondsInHour = 3600;
_dateo = new Date();
const offset = 0; //_dateo.getTimezoneOffset() * 60  * 1000 - 7200000;
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

    describe('initial set up', async () => {
        it('Get Oracle Contract Address', async () => {
            console.log(`Oracle Address is ${oracle.address}`);
        })

    it('Get Oracle Contract Address', async () => {
      const tokBal = web3.utils.fromWei(await token.balanceOf(accounts[0]), "finney");

    })

        it('Authorize Oracle Token', async () => {
            await token.approve(oracle.address, "560000000", {from: accounts[0]});
        })


        it("Deposit Tokens in Oracle Contract1", async () => {
        await oracle.depositTokens("560000000", {from: accounts[0]});
        })

        it("transfer tokens to betting account", async () => {
            await token.transfer(betting.address, "10000000");
        })

      });

        describe("set up Betting contract", async () => {

          it('checkHour', async () => {
            _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
            _date = new Date(1000 * _timestamp  + offset);
            _hour = _date.getHours();
               if (_hour < 10) {
               await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
           }
           })

            it("post initial data to oracle", async () => {
                var nextStart = firstStart + 7*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 1000, 500, 1000, 909, 800, 580, 900, 1120, 1010, 1340, 610, 1320, 1400, 1240, 610, 740, 560, 1450, 830, 590, 870, 750, 1430, 1370, 930, 570, 1420, 510, 820, 1050, 1310]);
            })


            it('fast forward 6 hours', async () => {
           _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
           _date = new Date(1000*_timestamp + offset);
           _hour = _date.getHours();
           await helper.advanceTimeAndBlock(secondsInHour * 6);
           })

        it("approve and send to betting contract", async () => {
                await oracle.initProcess();
            });

            it("Acct 0 Fund Betting Contract", async () => {

                await betting.fundBook({ from: accounts[0], value: '6000000000000000000' });
            })

            it("Acct 1 Fund Betting Contract", async () => {
                await betting.fundBook({ from: accounts[1], value: '4000000000000000000' });
            })

            it("Fund Betting Contract with 200 finney", async () => {
                await betting.fundBettor({ from: accounts[2], value: '10000000000000000000' });
            })
/*
            it("Fund Betting Contract with 200 finney", async () => {
                await betting.fundBettor({ from: accounts[3], value: '4000000000000000000' });
            })*/

            it("bumpTime", async () => {
                  _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                    await helper.advanceTimeAndBlock(86404);
            });

            it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
             }
             })

            it("Send Initial Event Results", async () => {
                await
                oracle.settlePost([1,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
            });

            it('fast forward 4 hours', async () => {
           _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
           _date = new Date(1000*_timestamp + offset);
           _hour = _date.getHours();
           await helper.advanceTimeAndBlock(secondsInHour * 6);
           })

            it("Approve and send result data", async () => {
                const result2 = await oracle.settleProcess();
                const gasUsed = result2.receipt.gasUsed;
                console.log(`gas on first settlement ${gasUsed}`);

            });

            it("Check State Variables in Betting Contract", async () => {
              const excessCapital = await betting.margin(0);
               const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
               const shares2 = await betting.margin(4);
               const sharesAcct0 = (await betting.lpStruct(accounts[0])).shares;
               const sharesAcct1 = (await betting.lpStruct(accounts[1])).shares;
               console.log(`excess capital ${excessCapital}`);
               console.log(`ethbal ${ethbal}`);
               console.log(`shares2 ${shares2}`);
               console.log(`sharesAcct0 ${sharesAcct0}`);
               console.log(`sharesAcct1 ${sharesAcct1}`);
/*
               assert.equal(Math.floor(sharesAcct0), "600", "Must be equal");
               assert.equal(Math.floor(sharesAcct1), "400", "Must be equal");
               assert.equal(Math.floor(excessCapital), "1000", "Must be equal");
               assert.equal(Math.floor(ethbal), "1400", "Must be equal");
               assert.equal(Math.floor(shares2), "1000", "Must be equal");*/
            })

            it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
             }
             })

            it("send initial data 2", async () => {
                var nextStart = firstStart + 14*86400;
              const result2 = await oracle.initPost(["NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","NFL:ARI:LAC","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Holloway:Kattar","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 1000, 500, 1000, 909, 800, 580, 900, 1120, 1010, 1340, 610, 1320, 1400, 1240, 610, 740, 560, 1450, 830, 590, 870, 750, 1430, 1370, 930, 570, 1420, 510, 820, 1050, 1310]);
              const gasUsed = result2.receipt.gasUsed;
              console.log(`gas on first post ${gasUsed}`);
            })

            it('fast forward 4 hours', async () => {
           _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
           _date = new Date(1000*_timestamp + offset);
           _hour = _date.getHours();
           await helper.advanceTimeAndBlock(secondsInHour * 6);
           })

        it("approve and send to betting contract #2", async () => {
                const result2 = await oracle.initProcess();
                const gasUsed = result2.receipt.gasUsed;
                console.log(`gas on initial send ${gasUsed}`);
            });

            it("bumpTime", async () => {
                  _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                  await helper.advanceTimeAndBlock(86404);
            });

            it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
             }
             })

            it("Send Event Results 2", async () => {
                await
                oracle.settlePost([1,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
            });

            it('fast forward 4 hours', async () => {
           _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
           _date = new Date(1000*_timestamp + offset);
           _hour = _date.getHours();
           await helper.advanceTimeAndBlock(secondsInHour * 6);
           })

            it("Approve and send result data 2", async () => {
                const result2 = await oracle.settleProcess();
                const gasUsed = result2.receipt.gasUsed;
                console.log(`gas on second settlement ${gasUsed}`);
            });

            it("withdraw 100 finney 'shares' for account 0", async () => {
                const ethout0 = await betting.withdrawBook("10000", {from: accounts[0]});
            });

            it("withdraw 50 finney shares for acct 1", async () => {
                const ethout1 = await betting.withdrawBook("5000", {from: accounts[1]});
            });

            it("Contract Balances after withdrawals", async () => {
              const excessCapital = await betting.margin(0);
               const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
               const shares2 = await betting.margin(4);
               const sharesAcct0 = (await betting.lpStruct(accounts[0])).shares;
               const sharesAcct1 = (await betting.lpStruct(accounts[1])).shares;
               console.log(`excess capital ${excessCapital}`);
               console.log(`ethbal ${ethbal}`);
               console.log(`shares2 ${shares2}`);
               console.log(`sharesAcct0 ${sharesAcct0}`);
               console.log(`sharesAcct1 ${sharesAcct1}`);
/*
               assert.equal(Math.floor(sharesAcct0), "500", "Must be equal");
               assert.equal(Math.floor(sharesAcct1), "350", "Must be equal");
               assert.equal(Math.floor(excessCapital), "850", "Must be equal");
               assert.equal(Math.floor(ethbal), "1250", "Must be equal");
               assert.equal(Math.floor(shares2), "850", "Must be equal");*/
            })

            it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour * (10 - _hour));
             }
             })

            it("send initial data 3", async () => {
                var nextStart = firstStart + 21*86400;
            const result2 = await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
            const gasUsed = result2.receipt.gasUsed;
            console.log(`gas on second post ${gasUsed}`);
            })


            it('fast forward 4 hours', async () => {
           _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
           _date = new Date(1000*_timestamp + offset);
           _hour = _date.getHours();
           await helper.advanceTimeAndBlock(secondsInHour * 6);
           })

        it("approve and send to betting contract #3", async () => {
                const result2 = await oracle.initProcess();
                const gasUsed = result2.receipt.gasUsed;
                console.log(`gas on second send ${gasUsed}`);
            });

            it("Bet 50 finney on match 0: team 0", async () => {
              const bookpool = await betting.margin(0);
              console.log(`bookieCap is ${bookpool}`);
                await betting.takeRegularBet(0, 0, "425", { from: accounts[2]});
            })

            it("bumpTime", async () => {
                  _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                  await helper.advanceTimeAndBlock(86404);
            });


            it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
             }
             })

            it("Send Event Results 3", async () => {
                await
                oracle.settlePost([1,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
            });

            it('fast forward 4 hours', async () => {
           _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
           _date = new Date(1000*_timestamp + offset);
           _hour = _date.getHours();
           await helper.advanceTimeAndBlock(secondsInHour * 6);
           })

            it("Approve and send result data 3", async () => {
                await oracle.settleProcess();
            });

            it("Contract Balances before withdrawals", async () => {
              const excessCapital = await betting.margin(0);
               const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
               const shares2 = await betting.margin(4);
               const sharesAcct0 = (await betting.lpStruct(accounts[0])).shares;
               const sharesAcct1 = (await betting.lpStruct(accounts[1])).shares;
               console.log(`excess capital ${excessCapital}`);
               console.log(`ethbal ${ethbal}`);
               console.log(`shares2 ${shares2}`);
               console.log(`sharesAcct0 ${sharesAcct0}`);
               console.log(`sharesAcct1 ${sharesAcct1}`);
/*
               assert.equal(Math.floor(sharesAcct0), "500", "Must be equal");
               assert.equal(Math.floor(sharesAcct1), "350", "Must be equal");
               assert.equal(Math.floor(excessCapital), "892", "Must be equal");
               assert.equal(Math.floor(ethbal), "1250", "Must be equal");
               assert.equal(Math.floor(shares2), "850", "Must be equal");*/
            })

            it("withdraw 100 finney for account 0", async () => {
                const ethout0 = await betting.withdrawBook("10000", {from: accounts[0]});
            });
/*
            it("findtime 0", async () => {
                  _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                    await helper.advanceTimeAndBlock(1615358625 - _timestamp);
            });
*/
            it("withdraw 50 finney for acct 1", async () => {
                const ethout1 = await betting.withdrawBook("5000", {from: accounts[1]});
            });

            it("Contract Balances after withdrawals", async () => {
              const excessCapital = await betting.margin(0);
               const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
               const shares2 = await betting.margin(4);
          const sharesAcct0 = (await betting.lpStruct(accounts[0])).shares;
          const sharesAcct1 = (await betting.lpStruct(accounts[1])).shares;
          console.log(`excess capital ${excessCapital}`);
          console.log(`ethbal ${ethbal}`);
          console.log(`shares2 ${shares2}`);
          console.log(`sharesAcct0 ${sharesAcct0}`);
          console.log(`sharesAcct1 ${sharesAcct1}`);
/*
          assert.equal(Math.floor(sharesAcct0), "400", "Must be equal");
          assert.equal(Math.floor(sharesAcct1), "300", "Must be equal");
              assert.equal(Math.floor(excessCapital), "735", "Must be equal");
               assert.equal(Math.floor(ethbal), "1092", "Must be equal");
               assert.equal(Math.floor(shares2), "700", "Must be equal");*/
            })

            it("Acct 3 Funds Betting Contract", async () => {
                await betting.fundBook({ from: accounts[0], value: "1000000000000000000" });
            })

            it("Contract Balances after getting 100 finney", async () => {
              const excessCapital =await betting.margin(0);
               const ethbal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "finney");
               const shares2 = await betting.margin(4);
               const sharesAcct0 = (await betting.lpStruct(accounts[0])).shares;
               const sharesAcct1 = (await betting.lpStruct(accounts[1])).shares;
               console.log(`excess capital ${excessCapital}`);
               console.log(`ethbal ${ethbal}`);
               console.log(`shares2 ${shares2}`);
               console.log(`sharesAcct0 ${sharesAcct0}`);
               console.log(`sharesAcct1 ${sharesAcct1}`);
/*
               assert.equal(Math.floor(sharesAcct0), "495", "Must be equal");
               assert.equal(Math.floor(sharesAcct1), "300", "Must be equal");
               assert.equal(Math.floor(excessCapital), "835", "Must be equal");
              assert.equal(Math.floor(ethbal*1000)/1000, "1192.5", "Must be equal");
              assert.equal(Math.floor(shares2*1000)/1000, "795.238", "Must be equal");*/
            })

          });




})
