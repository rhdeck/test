

2

it("transfer tokens to account 1", async () => {
    await token.transfer(accounts[1], "10000000000000000000000");
})

it('Authorize Oracle Token', async () => {
    await token.approve(oracle.address, "10000000000000000000000", {from: accounts[1]});
})

it("Deposit Tokens in Oracle Contract1", async () => {
await oracle.depositTokens("10000000000000000000000", {from: accounts[1]});
})

3

it("transfer tokens to account 1", async () => {
    await token.transfer(accounts[2], "20000000000000000000000");
})

it('Authorize Oracle Token', async () => {
    await token.approve(oracle.address, "20000000000000000000000", {from: accounts[2]});
})

it("Deposit Tokens in Oracle Contract1", async () => {
await oracle.depositTokens("20000000000000000000000", {from: accounts[2]});
})

5

it("transfer tokens to account 1", async () => {
    await token.transfer(accounts[3], "5000000000000000000000");
})

it('Authorize Oracle Token', async () => {
    await token.approve(oracle.address, "5000000000000000000000", {from: accounts[3]});
})

it("Deposit Tokens in Oracle Contract1", async () => {
await oracle.depositTokens("5000000000000000000000", {from: accounts[3]});
})

function transmitInit(
       string[32] memory _teamSchedule,
       uint256[32] memory _startTime,
       uint256[32] memory _decOdds,
       uint256 earlyStart
   ) external onlyAdmin {
       // initially the schedule, start times, and odds are supplied all at once
       // in the rare case that the schedule or start times must be adjusted, it would be through another submission
       // of all this data, which is costly in terms of gas, but should be rare
       earliestStart = earlyStart;
       startTime = _startTime;
       decOdds = _decOdds;
       teamSchedule = _teamSchedule;
   }

   // incrementally, odds will be adjusted, though the schedule and start times will not be
   function transmitDecOdds(uint256[32] memory _decOdds) external onlyAdmin {
       decOdds = _decOdds;

   }

   function adjustParams(uint256 _minbet, uint256 _maxPos) external onlyAdmin {
        minBet = _minbet * 1e15;
        concentrationLimit = _maxPos;
    }
