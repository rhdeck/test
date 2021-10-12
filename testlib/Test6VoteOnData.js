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

        it('New token balance', async () => {
          const tokBala = web3.utils.fromWei(await token.balanceOf(accounts[0]), "wei");
            console.log(`tokenBal is ${tokBala} 1e18`);
        })


    it('checkHour', async () => {
      _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
      _date = new Date(1000 * _timestamp  + offset);
      _hour = _date.getHours();
         if (_hour < 10) {
         await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
     }
     })

  });

    describe("TokenTransfer", async () => {

      it('New token balance 0', async () => {
        const tokBala = await token.balanceOf(accounts[0]);
          console.log(`tokenBal is ${tokBala}`);
      })

        it("transfer tokens to acct1", async () => {
            await token.transfer(accounts[1], "250000000", {from: accounts[0]});
            await token.transfer(accounts[2], "150000000", {from: accounts[0]});
            await token.approve(oracle.address, "400000000", {from: accounts[0]});
            await token.approve(oracle.address, "250000000", {from: accounts[1]});
            await token.approve(oracle.address, "150000000", {from: accounts[2]});
        await oracle.depositTokens("400000000", {from: accounts[0]});
        await oracle.depositTokens("250000000", {from: accounts[1]});
        await oracle.depositTokens("150000000", {from: accounts[2]});
        })

        it('New token balance', async () => {
          const tokBal10 = web3.utils.fromWei((await oracle.adminStruct(accounts[0])).tokens, "wei");
          const tokBal11 = web3.utils.fromWei((await oracle.adminStruct(accounts[1])).tokens, "wei");
          const tokBal12 = web3.utils.fromWei((await oracle.adminStruct(accounts[2])).tokens, "wei");
          const tokBal13 = web3.utils.fromWei(await token.balanceOf(oracle.address), "wei");
          console.log(`tokBal10 ${tokBal10}`);
          console.log(`tokBal11 ${tokBal11}`);
          console.log(`tokBal12 ${tokBal12}`);
          console.log(`tokBal13 ${tokBal13}`);
/*
          assert.equal(tokBal10, "40000", "Must be equal");
          assert.equal(tokBal11, "25000", "Must be equal");
          assert.equal(tokBal12, "15000", "Must be equal");
          assert.equal(tokBal13, "80000", "Must be equal");*/
        })
      });

        describe("setupBets", async () => {

          it('checkHour', async () => {
            _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
          //  await helper.advanceTimeAndBlock(secondsInHour * 2.02);
            _date = new Date(1000 * _timestamp  + offset);
          //  await helper.advanceTimeAndBlock(secondsInHour * 2);
            _hour = _date.getHours();
               if (_hour < 10) {
               await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
           }
           })

            it("send initial data", async () => {
                var nextStart = firstStart + 14*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart],  [955, 1000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800]);
            })

            it("pull reviewData1 ", async () => {
              const result = await oracle.params(1);
              console.log(`review1 ${result}`);
              const result2 = await oracle.params(5);
              console.log(`voteYes ${result2}`);
              const  _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
                console.log(`blocktime ${_timestamp}`);
              const result3 = await oracle.params(3);
                console.log(`timer ${result3}`);

            })

                it("fail: try to send too soon", async () => {
                    await oracle.initProcess();
                    const result = await oracle.underReview();
                    console.log(`review2 ${result}`);
                })


          it('fast forward 6 hours', async () => {
         await helper.advanceTimeAndBlock(secondsInHour * 6);
         })

         it("pull reviewData3 ", async () => {
           const result = await oracle.params(1);
           console.log(`review3 ${result}`);
         })

            it("fail: try post odds to oracle", async () => {
              var nextStart = firstStart + 14*86400;;
              await oracle.updatePost([nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [800, 999, 600, 1200, 1000, 800, 580, 900, 1120, 1010, 1340, 610, 1320, 1400, 1240, 610, 740, 560, 1450, 830, 590, 870, 750, 1430, 1370, 930, 570, 1420, 510, 820, 1050, 1310]);
          })

          it("fail:try to send results, not initial data", async () => {
              await oracle.settleProcess();
                await timeout(5000);
                await web3.utils.advanceBlockAtTime(now.toNumber());
          })
/*
          it("send initial data", async () => {
              var nextStart = firstStart + 7*86400;
await oracle.initPost(["NFL:ARI:LAC","NFL:ATL:LAR","NFL:BAL:MIA","NFL:BUF:MIN","NFL:CAR:NE","NFL:CHI:NO","NFL:CIN:NYG","NFL:CLE:NYJ","NFL:DAL:OAK","NFL:DEN:PHI","NFL:DET:PIT","NFL:GB:SEA","NFL:HOU:SF","NFL:IND:TB","NFL:JAX:TEN","NFL:KC:WSH","UFC:Holloway:Kattar","UFC:Ponzinibbio:Li","UFC:Kelleher:Simon","UFC:Hernandez:Vieria","UFC:Akhemedov:Breese","UFC:Memphis:Brooklyn","UFC:Boston:Charlotte","UFC:Milwaukee:Dallas","UFC:miami:LALakers","UFC:Atlanta:SanAntonia","NHL:Colorado:Washington","NHL:Vegas:StLouis","NHL:TampaBay:Dallas","NHL:Boston:Carolina","NHL:Philadelphia:Edmonton","NHL:Pittsburgh:NYIslanders"], [1628547467, 1628547467, 1628547467, 1628547467, 1628547467, 1628547467, 1628547467, 1628547467, 1628547467, 1628547467, 1609290000, 1628547467, 1628547467, 1628547467, 1628547467, 1609290000, 1628547467, 1628547467, 1628547467, 1628547467, 1609290000, 1628547467, 1628547467, 1628547467, 1628547467, 1609290000, 1628547467, 1628547467, 1628547467, 1628547467, 1609290000, 1628547467],  [955, 1000, 500, 1000, 909, 800, 510, 1240, 1470, 960, 650, 1330, 970, 730, 1310, 1040, 520, 1020, 1470, 1200, 1080, 820, 770, 790, 730, 690, 970, 760, 1000, 720, 1360, 800], 1628547467);
          })*/

          it('fast forward 3 days', async () => {
         await helper.advanceTimeAndBlock(secondsInHour * 192);
         })

        it("approve and send correct data to betting contract", async () => {
                await oracle.initProcess();
            })

            it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
             }
             })

            it("send updated odds data: 2000 for match 1, team 0", async () => {
              var nextStart = firstStart + 14*86400;;
                await oracle.updatePost( [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart], [800, 2000, 600, 1200, 1000, 800, 580, 900, 1120, 1010, 1340, 610, 1320, 1400, 1240, 610, 740, 560, 1450, 830, 590, 870, 750, 1430, 1370, 930, 570, 1420, 510, 820, 1050, 1310]);
            })

            it("vote yes on odds", async () => {
                await oracle.vote(true, {from: accounts[2]});
            })

            it("vote no on odds", async () => {
                await oracle.vote(false, {from: accounts[1]});
            })

            it("show votes", async () => {
                const yesvote = await oracle.params(5);
                const novote =await oracle.params(6);
                console.log(`Yes Votes ${yesvote}: No Votes ${novote}`);
/*
              assert.equal(yesvote, "55000", "Must be equal");
              assert.equal(novote, "25000", "Must be equal");*/
            })

            it('fast forward 6 hours', async () => {
           await helper.advanceTimeAndBlock(secondsInHour * 6);
           })

            it("process vote, should send odds", async () => {
                await oracle.updateProcess();
            })

            it("See updated odds, should be new 2000", async () => {
              const result2 = await betting.betData(1);
          //    assert.equal(result2, "2000", "Must be equal");
            })

            it('New token balance', async () => {
              const tokBal1 = web3.utils.fromWei((await oracle.adminStruct(accounts[0])).tokens, "wei");
              console.log(`tokBal ${tokBal1}`);
            //   assert.equal(tokBal1, "40000", "Must be equal");
            })

            it('checkHour', async () => {
              _timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
              _date = new Date(1000 * _timestamp  + offset);
              _hour = _date.getHours();
                 if (_hour < 10) {
                 await helper.advanceTimeAndBlock(secondsInHour* (10 - _hour));
             }
             })

            it("send updated odds data again: 3000 for match 0, team 0", async () => {
              var nextStart = firstStart + 14*86400;;
                await oracle.updatePost( [nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart, nextStart],[3000, 999, 600, 1200, 1000, 800, 580, 900, 1120, 1010, 1340, 610, 1320, 1400, 1240, 610, 740, 560, 1450, 830, 590, 870, 750, 1430, 1370, 930, 570, 1420, 510, 820, 1050, 1310]);
            })

            it("vote no on proposed odds", async () => {
                await oracle.vote(false, {from: accounts[1]});
            })

            it("vote no on proposed odds", async () => {
                await oracle.vote(false, {from: accounts[2]});
            })

            it('fast forward 6 hours', async () => {
           await helper.advanceTimeAndBlock(secondsInHour * 6);
           })

           it("show votes", async () => {
               const yesvote = await oracle.params(5);
               const novote = await oracle.params(6);
               console.log(`Yes Votes ${yesvote}: No Votes ${novote}`);

          //     assert.equal(yesvote, "40000", "Must be equal");
          //     assert.equal(novote, "40000", "Must be equal");
           })

            it("process should not send", async () => {
                await oracle.updateProcess();
            })

            it("should be old 2000, not new 3000", async () => {
              const result3 = await betting.betData(1);
              console.log(`result3 ${result3}`);

        //       assert.equal(result3, "2000", "Must be equal");

            })


        });

})
