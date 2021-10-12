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
var tokens0;
var tokens1;
var tokens2;
var tokens3;
var tokenstot;
var feepool;
var oracleBal;
var betEpoc;
var ethout8;
var ethout;
const firstStart = 1633695609;


require('chai').use(require('chai-as-promised')).should();

contract('Betting', function (accounts) {
    let betting, oracle, token;

    before(async () => {
        betting = await Betting.deployed();
        oracle = await Oracle.deployed();
        token = await Token.deployed();
    })

    describe('initial contract with one token owner', async () => {

            it('Authorize Oracle Token', async () => {
              await token.approve(oracle.address, "250000000", {from: accounts[0]});
            })

            it("Deposit Tokens in Oracle Contract0", async () => {
            await oracle.depositTokens("250000000", {from: accounts[0]});
            })

            it("transfer tokens to betting account", async () => {
                await token.transfer(betting.address, "250000000");
            })

    })


    describe('initial contract with one token owner', async () => {

            it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                  }
             })

            it("post initial data 1", async () => {
                var nextStart = firstStart + 7*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
            _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
            _date = new Date(1000*_timestamp + offset);
            await helper.advanceTimeAndBlock(secondsInHour * 6);
            _hour = _date.getHours();
                if (_hour < 10) {
                await helper.advanceTimeAndBlock(secondsInHour* (12 - _hour));
                }

                await oracle.initProcess();
             })

            it("Send  Bet #1", async () => {
          /*    const betBal = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "szabo");
               console.log(`betBal1 ${betBal}`);*/
                await betting.fundBook( { from: accounts[4], value: '5000000000000000000' });
                await betting.fundBettor({ from: accounts[5], value: '5000000000000000000' });
                const result = await betting.takeRegularBet(0, 0, "2000", { from: accounts[5]});
            /*    const betBal2 = web3.utils.fromWei(await web3.eth.getBalance(betting.address), "szabo");
                console.log(`betBal2 ${betBal2}`);
                const funderBal= web3.utils.fromWei(await web3.eth.getBalance(accounts[4].address), "szabo");
                console.log(`betBal ${funderBal}`);*/
            })


            it("bumpTime", async () => {
              /*    _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                  await helper.advanceTimeAndBlock(nextStart - _timestamp + 86400);*/
              _timestamp =
               (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                  }
             })

              it("Send Event Results 1", async () => {
                  await oracle.settlePost([0,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
              })

            it('fast forward 4 hours', async () => {
             _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
            _date = new Date(1000*_timestamp + offset);
            _hour = _date.getHours();
            await helper.advanceTimeAndBlock(secondsInHour * 6);
            await oracle.settleProcess();
            })

            it("checkOracleTokens 2", async () => {
                tokens0 = (await oracle.adminStruct(accounts[0])).tokens;
                tokens1 = (await oracle.adminStruct(accounts[1])).tokens;
                tokens2 = (await oracle.adminStruct(accounts[2])).tokens;
                tokens3 = (await oracle.adminStruct(accounts[3])).tokens;
                tokenstot = await token.balanceOf(oracle.address);
                betEpoc = await oracle.betEpoch();
                console.log(`epoch     acct0     acct1     acct2      acct3     total`);
                console.log(`${betEpoc}    `, `${tokens0}     `, `${tokens1}     `, `${tokens2}     `, `${tokens3}     `, `${tokenstot}`);
                oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "szabo");
                feePool = await oracle.feePool();
                console.log(`eth in Oracle Contract ${oracleBal}`);
                console.log(`feePool Tracker ${feePool}`);
            })
      })

      describe('Second epoch with two oracles', async () => {

        it("acct1 send tokens to oracle", async () => {
          const oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "szabo");
          const feePool = await oracle.feePool();
          console.log(`eth in Oracle Contract ${oracleBal}`);
          console.log(`feePool Tracker ${feePool}`);
            await token.transfer(accounts[1], "150000000");
            await token.approve(oracle.address, "150000000", {from: accounts[1]});
            await oracle.depositTokens("150000000", {from: accounts[1]});
      })


              it('checkHour', async () => {
                _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                _date = new Date(1000 * _timestamp  + offset);
                _hour = _date.getHours();
                   if (_hour < 10) {
                   await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                    }
               })

              it("post initial data 2", async () => {
                  var nextStart = firstStart + 14*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"],[nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
              })

              it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000*_timestamp + offset);
              _hour = _date.getHours();
                  if (_hour < 10) {
                  await helper.advanceTimeAndBlock(secondsInHour* (12 - _hour));
                  }
                  await helper.advanceTimeAndBlock(secondsInHour * 6);
                   await oracle.initProcess();
               })


              it("Check Oracle account before bet payout", async () => {
                const tokens0 = (await oracle.adminStruct(accounts[0])).tokens;
                const tokens1 = await token.balanceOf(oracle.address);
                const oracleEthOracle = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "szabo");
                  console.log(`token account0 ${tokens0}`);
                  console.log(`token account1 ${tokens1}`);
                  console.log(`eth in Oracle Contract ${oracleEthOracle}`);
              })

              it("Send  Bet #2", async () => {
                  const result = await betting.takeRegularBet(0, 0, "2000", { from: accounts[5]});
                  const odds = web3.utils.fromWei(result.logs[0].args.payoff, "finney");
              })



              it("bumpTime", async () => {
                    _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                    await helper.advanceTimeAndBlock(86400);
                _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                _date = new Date(1000 * _timestamp  + offset);
                _hour = _date.getHours();
                   if (_hour < 10) {
                   await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                    }
               })

                it("Send Event Results 2", async () => {
                    await oracle.settlePost([0,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
                })



              it('fast forward 4 hours', async () => {
             _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
             _date = new Date(1000*_timestamp + offset);
             _hour = _date.getHours();
             await helper.advanceTimeAndBlock(secondsInHour * 6);
                  await oracle.settleProcess();
              })

              it("checkOracleTokens 3", async () => {
                tokens0 = (await oracle.adminStruct(accounts[0])).tokens;
                tokens1 = (await oracle.adminStruct(accounts[1])).tokens;
                tokens2 = (await oracle.adminStruct(accounts[2])).tokens;
                tokens3 = (await oracle.adminStruct(accounts[3])).tokens;
                tokenstot = await token.balanceOf(oracle.address);
                betEpoc = await oracle.betEpoch();
                console.log(`epoch     acct0     acct1     acct2      acct3     total`);
                console.log(`${betEpoc}    `, `${tokens0}     `, `${tokens1}     `, `${tokens2}     `, `${tokens3}     `, `${tokenstot}`);
                oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "szabo");
                feePool = await oracle.feePool();
                console.log(`eth in Oracle Contract ${oracleBal}`);
                console.log(`feePool Tracker ${feePool}`);
              })

        })

        describe('third epoch with three oracles', async () => {

          it("transfer tokens from account 2", async () => {
              await token.transfer(accounts[2], "100000000");
              await token.approve(oracle.address, "100000000", {from: accounts[2]});
          await oracle.depositTokens("100000000", {from: accounts[2]});
          })

                it('checkHour', async () => {
                  _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                  _date = new Date(1000 * _timestamp  + offset);
                  _hour = _date.getHours();
                     if (_hour < 10) {
                     await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                      }
                 })

                it("post initial data 3", async () => {
                    var nextStart = firstStart + 21*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"],[nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
                })


                it('checkHour', async () => {
                _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                _date = new Date(1000*_timestamp + offset);
                _hour = _date.getHours();
                    if (_hour < 10) {
                    await helper.advanceTimeAndBlock(secondsInHour* (12 - _hour));
                    }
                    await helper.advanceTimeAndBlock(secondsInHour * 6);
                     await oracle.initProcess();
                 })


                it("Send  Bet #3", async () => {
                    const result = await betting.takeRegularBet(0, 0, "2000", { from: accounts[5]});
                    const odds = web3.utils.fromWei(result.logs[0].args.payoff, "finney");
                })


                it("bumpTime", async () => {
                      _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                      await helper.advanceTimeAndBlock(1631322894 - _timestamp + 86400);
                  _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                  _date = new Date(1000 * _timestamp  + offset);
                  _hour = _date.getHours();
                     if (_hour < 10) {
                     await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                      }
                 })

                  it("Send Event Results 3", async () => {
                      await oracle.settlePost([0,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
                  })


                it('fast forward 4 hours', async () => {
               _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
               _date = new Date(1000*_timestamp + offset);
               _hour = _date.getHours();
               await helper.advanceTimeAndBlock(secondsInHour * 6);
                    await oracle.settleProcess();
                })

                it("Acct 0 withdraw Tokens acct1", async () => {
                  const result = await oracle.withdrawTokens("50000000",{ from: accounts[0] });
                  ethout = web3.utils.fromWei(result.logs[0].args.etherChange, "szabo");
                  //assert.equal(Math.floor(ethout), "2125", "Must be equal");

                  console.log(`finney Out0 ${ethout}`);
                  const tokensout = result.logs[0].args.tokensChange;
                  console.log(`tokens Out0 ${tokensout}`);
              })

                it("checkOracleTokens 4", async () => {
                  tokens0 = (await oracle.adminStruct(accounts[0])).tokens;
                  tokens1 = (await oracle.adminStruct(accounts[1])).tokens;
                  tokens2 = (await oracle.adminStruct(accounts[2])).tokens;
                  tokens3 = (await oracle.adminStruct(accounts[3])).tokens;
                  tokenstot = await token.balanceOf(oracle.address);
                  betEpoc = await oracle.betEpoch();
                  console.log(`epoch     acct0     acct1     acct2      acct3     total`);
                  console.log(`${betEpoc}    `, `${tokens0}     `, `${tokens1}     `, `${tokens2}     `, `${tokens3}     `, `${tokenstot}`);
                  oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "szabo");
                  feePool = await oracle.feePool();
                  console.log(`eth in Oracle Contract ${oracleBal}`);
                  console.log(`feePool Tracker ${feePool}`);
                })

          })

          describe('fourth epoch with three oracles', async () => {

                  it('checkHour', async () => {
                    _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                    _date = new Date(1000 * _timestamp  + offset);
                    _hour = _date.getHours();
                       if (_hour < 10) {
                       await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                        }
                   })


                  it("post initial data 4", async () => {
                      var nextStart = firstStart + 28*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
                  })

                  it('checkHour', async () => {

                  _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                  _date = new Date(1000*_timestamp + offset);
                  _hour = _date.getHours();
                      if (_hour < 10) {
                      await helper.advanceTimeAndBlock(secondsInHour* (12 - _hour));
                      }
                      await helper.advanceTimeAndBlock(secondsInHour * 6);
                       await oracle.initProcess({from: accounts[1]});
                   })

                  it("Send  Bet #4", async () => {
                //    _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                      const result = await betting.takeRegularBet(0, 0, "2000", { from: accounts[5]});
                  })




                  it("bumpTime", async () => {
                        _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                        await helper.advanceTimeAndBlock(86400);
                    _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                    _date = new Date(1000 * _timestamp  + offset);
                    _hour = _date.getHours();
                       if (_hour < 10) {
                       await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                        }
                   })

                    it("Send Event Results 4", async () => {
                        await oracle.settlePost([0,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], {from: accounts[1]});
                    })


                  it('fast forward 4 hours', async () => {
                 _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                 _date = new Date(1000*_timestamp + offset);
                 _hour = _date.getHours();
                 await helper.advanceTimeAndBlock(secondsInHour * 6);
                      await oracle.settleProcess( {from: accounts[1]});

                  })

                  it("checkOracleTokens 5", async () => {
                    tokens0 = (await oracle.adminStruct(accounts[0])).tokens;
                    tokens1 = (await oracle.adminStruct(accounts[1])).tokens;
                    tokens2 = (await oracle.adminStruct(accounts[2])).tokens;
                    tokens3 = (await oracle.adminStruct(accounts[3])).tokens;
                    tokenstot = await token.balanceOf(oracle.address);
                    betEpoc = await oracle.betEpoch();
                    console.log(`epoch     acct0     acct1     acct2      acct3     total`);
                    console.log(`${betEpoc}    `, `${tokens0}     `, `${tokens1}     `, `${tokens2}     `, `${tokens3}     `, `${tokenstot}`);
                    oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "szabo");
                    feePool = await oracle.feePool();
                    console.log(`eth in Oracle Contract ${oracleBal}`);
                    console.log(`feePool Tracker ${feePool}`);
                  })

                  it("withdraw Tokens acct1", async () => {
                    const result = await oracle.withdrawTokens("150000000",{ from: accounts[1] });
                    ethout = web3.utils.fromWei(result.logs[0].args.etherChange, "szabo");
                    //ethout= Number(ethout).toFixed(0);
                    //assert.equal(Math.floor(ethout), "1008", "Must be equal");
                    console.log(`finney Out1 ${ethout}`);
                    const tokensout = result.logs[0].args.tokensChange;
                    console.log(`tokens Out1 ${tokensout}`);
                })

            })

            describe('fifth epoch with 2 oracles', async () => {


                    it('checkHour', async () => {
                      _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                      _date = new Date(1000 * _timestamp  + offset);
                      _hour = _date.getHours();
                         if (_hour < 10) {
                         await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                          }
                     })

                    it("post initial data 5", async () => {
                        var nextStart = firstStart + 35*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [1000, 2000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
                    })

                    it('checkHour', async () => {
                    _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                    _date = new Date(1000*_timestamp + offset);
                    _hour = _date.getHours();
                        if (_hour < 10) {
                        await helper.advanceTimeAndBlock(secondsInHour* (12 - _hour));
                        }
                     })

                     it("approve and send to betting contract", async () => {
                        await helper.advanceTimeAndBlock(secondsInHour * 6);
                         await oracle.initProcess( {from: accounts[0]});
                        const result = await betting.takeRegularBet(0, 0, "2000", { from: accounts[5]});
                    })


                    it("bumpTime", async () => {
                          _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                          await helper.advanceTimeAndBlock(1632878094 - _timestamp + 86400);
                      _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                      _date = new Date(1000 * _timestamp  + offset);
                      _hour = _date.getHours();
                         if (_hour < 10) {
                         await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
                          }
                     })

                      it("Send Event Results 5", async () => {
                          await oracle.settlePost([0,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], {from: accounts[0]});
                      })


                    it('fast forward 4 hours', async () => {
                   _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                   _date = new Date(1000*_timestamp + offset);
                   _hour = _date.getHours();
                   await helper.advanceTimeAndBlock(secondsInHour * 6);
                        await oracle.settleProcess( {from: accounts[0]});
                    })

                    it("checkOracleTokens 6", async () => {
                      tokens0 = (await oracle.adminStruct(accounts[0])).tokens;
                      tokens1 = (await oracle.adminStruct(accounts[1])).tokens;
                      tokens2 = (await oracle.adminStruct(accounts[2])).tokens;
                      tokens3 = (await oracle.adminStruct(accounts[3])).tokens;
                      tokenstot =await token.balanceOf(oracle.address);
                      betEpoc = await oracle.betEpoch();
                      console.log(`epoch     acct0     acct1     acct2      acct3     total`);
                      console.log(`${betEpoc}    `, `${tokens0}     `, `${tokens1}     `, `${tokens2}     `, `${tokens3}     `, `${tokenstot}`);
                      oracleBal = web3.utils.fromWei(await web3.eth.getBalance(oracle.address), "szabo");
                      feePool = await oracle.feePool();
                      console.log(`eth in Oracle Contract ${oracleBal}`);
                      console.log(`feePool Tracker ${feePool}`);
                    })

                    it("withdraw Tokens acct0 and acct2", async () => {
                      const result = await oracle.withdrawTokens("200000000",{ from: accounts[0] });
                      ethout8 = web3.utils.fromWei(result.logs[0].args.etherChange, "szabo");
                      console.log(`finney Out0 ${ethout8}`);
                      const tokensout = result.logs[0].args.tokensChange;
                      console.log(`tokens Out0 ${tokensout}`);
                      const result1 = await oracle.withdrawTokens("100000000",{ from: accounts[2] });
                      ethout = web3.utils.fromWei(result1.logs[0].args.etherChange, "szabo");
                      console.log(`tokens Out2 ${ethout}`);
                      const tokensout1 = result1.logs[0].args.tokensChange;
                      console.log(`tokens Out2 ${tokensout1}`);
                  })
       })

     })
