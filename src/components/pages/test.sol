/**
SPDX-License-Identifier: MIT
Copyright © 2020 Eric G. Falkenstein
*/
pragma solidity ^0.8.0;


contract test32b {

    // odds are entered as decimal odds, such that 1.909 is 909, and 2.543 is 1543.   (decOdds/1000+1) is the total payoff for a winning bet,
    // consisting of a profit of decOdds/1000 and a return of the bet.

   /* uint32[32] public decOdds;
    // startTime in UTC is used to stop active betting. If a game is postponed, it may be updated. No bets are taken after this time.
    uint32[32] public startTime;
    // this is the amount bet on each team to win, and so via the schedule. A 'short' would be on the opponent to win.
    uint32[32][2] public betLong;
    // this is the amount payable to bettors by the contract should their pick win. It is used to determine how much to set
    // aside for future redemptions at settle.
    uint32[32][2] public betPayout;
    // 0 LP unused capital, 1 LP used Capital, 2 bettor capital, 3 bettor amounts
    // 4 bettor eth available for withdraw or betting, 5 big bet collateral,
    uint32[6] public margin;
    // totalShares is used to monitor an LP's share of LP eth in the contract. These are not tokens, they are just used for internal
    // accounting of the LP's percent ownership of the vig implied by the odds.*/
    // this struct holds each bettor's bet contract parameters
    // after each settlement, a new epoch commences. Bets cannot consummate on games referring to prior epochs
    uint8 public betEpoch;
    uint32 public totalShares;
    // this is a parameter for a minimum bet, which can be adjusted by the oracle/admin.
    //uint32 public minBet;
    // this is used to stop LP funding, because once a game starts, the unused capital account could be worth zero or double
    // based on what happened in the game, and LPs would have an incentive to zero-out of invest too much
    //uint32 public earliestStart;
    // this is a parameter for a maximum bet exposure. If LP capital is X, X/concentrationLimit is the largest absolute net
    // exposure for any game. At that point, only bets decreasing the LP exposure are permitted. This prevents a situation where
    // one game uses up all the LP capital for a epoch. It should be adjusted during the playoff, as the number of games will
    // obviously decrease
    uint32 public concentrationLimit;
    // this counter is used to make bet IDs unique
    uint32 public nonce;
    address payable public oracleAdmin;
    // the tokens sent to the contract initially are for distribution to liquidity providers at the end of the season.
    // Linking to the token contract allows this contract to distribute those shares. No shares are deposited in this contract.
    // tokens claimed go straight to the liquidity provider (LP) account.
    mapping(bytes32 => Subcontract) public subcontracts;
    // this maps the hash of (team number, epoch) to that team/epoch's outcome, where 0 is a loss, 1 is a tie or postponement, 2 a win
    // The outcome defaults to 0, so that initially, when contract epoch = current epoch, all games are 0, When the contract epoch< current epoch,
    // 0 represents a loss
    mapping(uint32 => uint8) public EpochMatchWinnerOutput;
    // this struct holds a big bet's bet parameters, its contractID will become the offeror's bet ID if taken
    // if taken, the offercontract is deleted
    mapping(bytes32 => Offercontract) public offercontracts;
    // This keeps track of an LP's ownership in the LP ether capital, and also its date of investment to encourage vesting for
    // claiming tokens
    mapping(address => LPStruct) public lpStruct;

    // this struct holds a user's ETH balance
    mapping(address => uint32) public userBalance;
    // Schedule is a string where Sport:FavoriteTeam:UnderdogTeam
    // eg, "NFL:Minnesota:Chicago"
    // string[32] public teamSchedule;
    // this is the only ethereum account that can adjust parameters, set odds, schedule, etc. There is no other party with access to
    // methods that affect payouts
    //mapping(uint8 => Matches) public matches;
    Matches[32] public matches;
    Margin public margin;



    struct Matches {
        uint32 decOdds;
        uint32[2] long;
        uint32[2] payoff;
        uint32 startTime;
        string teamSchedule;
    }

    struct Margin {
          uint32 bookfree;
          uint32 booktaken;
          uint32 betLocked;
          uint32 userBalance;
        }

    struct Subcontract {
        uint8 pick;
        uint8 matchNum;
        uint8 epoch;
        uint32 betAmount;
        uint32 payoff;
        address bettor;
    }

    struct Offercontract {
        uint8 pick;
        uint8 matchNum;
        uint8 epoch;
        uint32 betAmount;
        uint32 payoff;
        address bettor;
    }

    struct LPStruct {
        uint32 shares;
        uint8 outEpoch;
    }

    event BetRecord(
        address indexed bettor,
        uint8 indexed epoch,
        bytes32 contractHash,
        uint8 pick,
        uint8 matchnum,
        uint32 betsize,
        uint32 payoff
    );

    event BetBigRecord(
        address indexed bettor,
        uint8 indexed epoch,
        bytes32 contractHash,
        uint8 pick,
        uint8 matchnum,
        uint32 betsize,
        uint32 payoff
    );

    event Cashflow(
        address account,
        uint32 etherCredit,
        string activity
    );

    constructor() {
      //  minBet = 1;
        concentrationLimit = 5;
        betEpoch = 1;
      //  earliestStart = 2e9;
    }

    modifier onlyAdmin() {
        require(1 == 1);
        _;
    }

    function setOracleAddress(address payable _oracleAddress) external {
        require(oracleAdmin == address(0x0), "Only once");
        oracleAdmin = _oracleAddress;
    }

    receive() external payable {}


    function pop() external {
     // uint32 amt = 8000000000000000;
      uint32 amt = 8000;

for (uint8 i = 0; i < 32; i++) {
      matches[i].long[0] += amt;
      matches[i].payoff[0] += amt; //(amt * odds(i, 0)) / 1000;
      matches[i].long[1] += amt;
      matches[i].payoff[1] += amt; //(amt * odds(i, 1)) / 1000;
      margin.booktaken += amt;
      margin.betLocked += amt;
    }

    }

    function takeRegularBet(
        uint8 matchNumber,
        uint8 team0or1,
        uint32 amt
    ) external {
       // require(amt >= minBet, "bet below minimum");
        require(amt <= userBalance[msg.sender], "NSF ");
        require(
            matches[matchNumber].startTime > block.timestamp,
            "game started or not playing"
        );
        // current LP exposure if team/player wins, which is the net of the LP obligation to the winner minus
        // the amount bet on the opponent that will be available to the LPs
        // note for arrays, the arguments are [team][match], where team is either 0 or 1, and matches run from 0 to 31
        //
        int32 netPosTeam0 =
            int32(matches[matchNumber].payoff[team0or1]) -
                int32(matches[matchNumber].long[1-team0or1]);
        // current liability of LP if opponent team loses
        int32 netPosOpponent0 =
            int32(matches[matchNumber].payoff[1-team0or1]) -
                int32(matches[matchNumber].long[team0or1]);
        // this is the incremental, stand-alone liability from taking this bet, how much the LP's lose if this bet wins
        uint32 _payoff = (amt * odds(matchNumber, team0or1)) / 1000;
        // this function measures the change in the net liability from this bet, which is a function of how
        // much it changes the maximum liability for this match
        int32 marginChange =
            maxZero(
                int32(_payoff) + netPosTeam0,
                -int32(amt) + netPosOpponent0
            ) - maxZero(netPosTeam0, netPosOpponent0);
        // this checks to see that exposure on this one game is not too large
        // relative to the amount of LP eth in the contract
        require(
            int32(_payoff) + netPosTeam0 <
                int32((margin.bookfree + margin.booktaken) / concentrationLimit),
            "betsize over concentration limit"
        );
        // this  requires the LP has enough unpledged capital to cover the new bet
        require(
            marginChange <= int32(margin.bookfree),
            "betsize over unpledged capital"
        );
        // an incrementing nonce and timestamp make a unique bet hash ID
        userBalance[msg.sender] -= amt;
        bytes32 subkID = keccak256(abi.encodePacked(nonce, block.timestamp));
        Subcontract memory order;
        order.bettor = msg.sender;
        order.betAmount = amt;
        order.payoff = _payoff;
        order.pick = team0or1;
        order.matchNum = matchNumber;
        order.epoch = betEpoch;
        subcontracts[subkID] = order;
        // the bettor's eth is put into the bettor capital pot. This will be added to the LP's capital pot for
        // extracting payout amounts
        margin.userBalance -= amt;
        margin.betLocked += amt;
        // if the bet decreases net LP exposure to that game, eth moves from the LP's pledged capital, margin.booktaken
        // to the unpledged capital, margin.bookfree
        if (marginChange < 0) {
            margin.booktaken = subtract(margin.booktaken, uint32(-marginChange));
            margin.bookfree += uint32(-marginChange);
            // if the bet increases net LP exposure to that game, eth moves from unpledged capital
            // to the LP pledged capital from the unpledged capital
        } else {
            margin.booktaken += uint32(marginChange);
            margin.bookfree = subtract(margin.bookfree, uint32(marginChange));
        }
        // bet adds to the amount bet on team
        matches[matchNumber].long[team0or1] += amt;
        // the payoff, or profit, paid by the LPs to the bettor if his team wins.
        // it is not paid in the case of a tie
         matches[matchNumber].long[team0or1] += _payoff;
        // increment nonce for subkID uniqueness
        nonce++;
        emit BetRecord(
            msg.sender,
            betEpoch,
            subkID,
            team0or1,
            matchNumber,
            amt,
            _payoff
        );
    }

    function postBigBet(
        uint8 _matchNum,
        uint8 _team0or1,
        uint32 amt,
        uint32 decOddsBB
    ) external {
        require(
            amt >= margin.bookfree/concentrationLimit && amt <= userBalance[msg.sender],
            "too small or NSF"
        );
        require(decOddsBB > 1000 && decOddsBB < 9999, "invalid odds");
        bytes32 subkID = keccak256(abi.encodePacked(nonce, block.timestamp));
        Offercontract memory order;
        order.pick = _team0or1;
        order.matchNum = _matchNum;
        order.epoch = betEpoch;
        order.bettor = msg.sender;
        order.betAmount = amt;
        order.payoff = ((decOddsBB - 1000) * amt) / 1000;
        offercontracts[subkID] = order;
        nonce++;
        emit BetBigRecord(
            msg.sender,
            betEpoch,
            subkID,
            _team0or1,
            order.matchNum,
            order.betAmount,
            order.payoff
        );
    }

    function takeBigBet(bytes32 subkid) external {
        Offercontract storage k = offercontracts[subkid];
        require(matches[k.matchNum].startTime > block.timestamp, "game started");
        require(
            userBalance[msg.sender] >= k.payoff && k.epoch == betEpoch,
            "NSF or expired bet"
        );
        require(
            userBalance[k.bettor] >= k.betAmount, "NSF or expired bet"
        );
        // first we create the new bet of the initial bigbet proposer based on their original parameters
        userBalance[k.bettor] -= k.betAmount;
        Subcontract memory order;
        order.betAmount = k.betAmount;
        order.pick = k.pick;
        order.matchNum = k.matchNum;
        order.epoch = betEpoch;
        order.bettor = k.bettor;
        order.payoff = k.payoff;
        // the offeror's bet is recorded in this struct
        subcontracts[subkid] = order;
       // margin.bigbets -= k.betAmount;
        emit BetRecord(
            order.bettor,
            betEpoch,
            subkid,
            order.pick,
            order.matchNum,
            order.betAmount,
            order.payoff
        );
        // next we create the taker's bet, where the taker is long the offeror's opponent
        bytes32 subkID2 = keccak256(abi.encodePacked(nonce, block.timestamp));
        Subcontract memory order2;
        order2.bettor = msg.sender;
        // note the bet amount for the taker is identical to the payoff of the initial bet
        order2.betAmount = k.payoff;
        order2.payoff = k.betAmount;
        // payoff of the offered bet is the taker bet amount
        userBalance[msg.sender] -= k.payoff;
       // margin.userBalance -= (k.payoff + k.betAmount);
        order2.matchNum = order.matchNum;
        order2.pick = 1 - k.pick;
        order2.epoch = betEpoch;
        // in these bets only bettor money is liable upon game outcome, so each side covers the liability to the other
        margin.betLocked += (k.betAmount + order2.betAmount);
        // this is the new gross liability to original bettor team if it wins
        matches[order.matchNum].long[order.pick] += order.betAmount;
        matches[order.matchNum].payoff[order.pick] += k.payoff;
        // this is the new gross liability to this taker's team wins
        matches[order2.matchNum].long[order2.pick] += order2.payoff;
        matches[order2.matchNum].payoff[order2.pick] += k.payoff;
        emit BetRecord(
            msg.sender,
            betEpoch,
            subkID2,
            order2.pick,
            order2.matchNum,
            order2.betAmount,
            order2.payoff
        );
        subcontracts[subkID2] = order2;
        nonce++;
        // deletes the old offer so it cannot be taken again
        delete offercontracts[subkid];
    }

    function cancelBigBet(bytes32 subkid2) external {
        Offercontract storage k = offercontracts[subkid2];
        // only the bettor can cancel his bet. Only a bet not yet taken can be cancelled
        // because when taken the struct offercontracts is deleted
        require(k.bettor == msg.sender, "wrong account");
        delete offercontracts[subkid2];
    }

    function settle(uint8[32] memory winner)
        external
        onlyAdmin
        returns (uint8, uint32)
        {
            // LP pledged capital, margin.booktaken, and bettor funds, margin.betLocked, are combined into a pot.
            // Whatever is not paid-out to the bettors is then transferred to the LPs.
            uint32 housePot = add(margin.booktaken, margin.betLocked);
            // this is the account tracking the sum of eth owed to bettors (wins and ties)
            // from the initial bet.
            uint32 redemptionPot;
            // this is the account tracking the sum of eth owed to bettors (wins and ties)
            // from the profit from the winning bets
            uint32 payoffPot;
            uint32 EpochMatchWinner;
            // resets the margin accounts 'pledged LP capital'[1] and 'bettor capital'[2] for the next epoch
            delete margin.booktaken ;
            delete margin.betLocked ;
            for (uint8 i = 0; i < 32; i++) {
                // this tracks the match outcome, and is assigned to reduce gas costs
                uint8 winningTeam = winner[i];
                require(winningTeam < 3);
                // if 0 or 1, this represents the Favorite or Underdog as winner, respectively
                if (winningTeam == 0) {
                    redemptionPot += matches[i].long[winningTeam];
                    payoffPot += matches[i].payoff[winningTeam];
                    EpochMatchWinner = uint32(winningTeam) + uint32(i) * 10 + uint32(betEpoch) * 1000;

                  // this unique match&epoch&team hash will map to a win, 2, allowing bettors to claim their winnings
                  // via the redeem method.
                    EpochMatchWinnerOutput[EpochMatchWinner] = 2;
                    // for ties, no-contest or cancellations, both bettors are refunded their bet amounts
                } else
                    {
                    EpochMatchWinner = uint32(winningTeam) + uint32(i) * 10 + uint32(betEpoch) * 1000;
                    redemptionPot = add(matches[i].long[0], matches[i].long[1]);
                    // the bettor's subcontract--match/epoch/team--will now map to a 'tie', coded as 1
                    // the default value of EpochMatchWinnerOutput[] is 0, which is like a loss in that bettor gets
                    // no eth back, so this mapping need not be assigned
                    EpochMatchWinnerOutput[EpochMatchWinner] = 1;
                    EpochMatchWinnerOutput[EpochMatchWinner] = 1;
                }
            }

            // this subtracts redemptionPot from bettor capital and LP pledged capital
            housePot = subtract(housePot, redemptionPot + payoffPot);
            // LPs get what remains
            margin.bookfree += housePot;
            // incrementing the epoch affects LP withdrawals, token claimTokens
            // it also makes it so that no one can bet on old games
            betEpoch++;
            // money reallocated to accounts
            // allocate payout to the oracle
            uint32 oracleDiv = (5 * payoffPot) / 100;
            oracleAdmin.transfer(oracleDiv);
            // bettors get revenue minus the oracle fee
            margin.userBalance += (redemptionPot + payoffPot - oracleDiv);
            // old positions are reset to zero for the next epoch for margin calculations
            return (betEpoch, oracleDiv);

        }

    function fundBettor() external payable {
        uint32 amt = uint32(msg.value/1e12);
        margin.userBalance = add(margin.userBalance,amt);
        userBalance[msg.sender] += amt;
        emit Cashflow(msg.sender, amt, "fund bettor");
    }
    function fundBook() external payable {
        // not allowed when games are played because that game results affect the value of the book's shares
        // not reflected in the house eth value, so when games start, no LP withdrawal or funding is _allowed
        // at settlement 'earliestStart' is set to 2e9, which is well into the future, so LPs can WD or fund again
        require(block.timestamp < matches[0].startTime, "only prior to first event");
        uint32 netinvestment = uint32(msg.value/1e12);
        uint32 _shares = 0;
            // investors receive shares marked at fair value, the current shares/eth ratio for all
            // LP's eth in the book is the sum of pledged, margin.booktaken, and unpledged, margin.bookfree, eth
            _shares =multiply(netinvestment, totalShares) /
                  (margin.bookfree + margin.booktaken + 1);
        margin.bookfree = add(margin.bookfree, netinvestment);
        // adding funds to an account resets the 'start date' relevant for withdrawal and claiming tokens
        lpStruct[msg.sender].outEpoch = betEpoch + 1;
        totalShares += _shares;
        lpStruct[msg.sender].shares += _shares;
        emit Cashflow(msg.sender, netinvestment, "fund");
    }

    function redeem(bytes32 _subkId) external {
        Subcontract storage k = subcontracts[_subkId];
        require(k.bettor == msg.sender, "wrong account");

        // checks teamEpochHash to see if bet receives money back
          uint32  EpochMatchWinner = uint32(k.pick) + uint32(k.matchNum) * 10 + uint32(k.epoch) * 1000;
        uint8 gameOutcome = EpochMatchWinnerOutput[EpochMatchWinner];
        // 0 is for a loss or no outcome reported yet
        require(gameOutcome != 0, "need win or tie");
        // both ties and wins receive back their initial bet amount, so this is the start
        // whether a win or tie
        uint32 payoff = k.betAmount;
        // if a winner, add the payoff amount
        if (gameOutcome == 2) {
            // the oracle revenue comes out of a 5% fee applied to bettor payouts,
            // this is about half of the total vig, which is 5% of bet amount
            payoff += (k.payoff * 95) / 100;
        }
        // adds to the bettor funds account
        margin.userBalance += payoff;
        delete subcontracts[_subkId];
        userBalance[msg.sender] += payoff;
    }

    function withdrawBettor(uint32 amt) external {
        require(amt <= userBalance[msg.sender]);
        margin.userBalance -= amt;
        userBalance[msg.sender] -= amt;
        emit Cashflow(msg.sender, amt, "wd bettor");
        uint256 amt256 = uint256(amt)*1e12;
        payable(msg.sender).transfer(amt256);
    }

    function withdrawBook(uint32 sharesToSell) external {
        // same reason as given above in fundBook
        require(block.timestamp < matches[0].startTime, "only prior to first event");
        require(lpStruct[msg.sender].shares >= sharesToSell, "overdraft");
        // investors can only cashout after investing for at least 2 epochs, this allows LPs to better anticipate the
        // economics of investing as an LP
        require(betEpoch > lpStruct[msg.sender].outEpoch, "too soon");
        // margin.bookfree + margin.booktaken is the total eth amount of the LPs
        uint32 ethWithdraw =
            multiply(sharesToSell, (margin.bookfree + margin.booktaken)) / totalShares;
        // one can withdraw at any time during the epoch, but only if the LP eth balances that are
        // unpledged, or free, and not acting as collateral
        require(
            ethWithdraw <= margin.bookfree,
            "can only withdraw unpledged capital"
        );
        totalShares -= sharesToSell;
        lpStruct[msg.sender].shares -= sharesToSell;
        margin.bookfree -= ethWithdraw;
        emit Cashflow(msg.sender, ethWithdraw, "withdraw");
        uint256 ethWithdraw256 = uint(256)*1e12;
        payable(msg.sender).transfer(ethWithdraw256);
    }

    function inactiveBook() external {
        // this is just a safety method in case the oracles become incapacitated and money is stuck in the contract
        // it allows bettors and LPs to get their eth back as if all the games were ties
        // bettors would still have to redeem before withdrawing, and LPs would have to sell shares
        // the time limit of 2e6 seconds is about 23 days
        require(block.timestamp > matches[0].startTime + 2e6, "contract still active");
        margin.bookfree += margin.booktaken;
        margin.userBalance += margin.betLocked;
        margin.booktaken = 0;
        margin.betLocked = 0;
        uint32  EpochMatchWinner = 0;
        uint8 i;
        uint8 team = 0;
        // games are treated as if they were all ties, giving users their eth back. They do need to redeem them, however.
        for (i = 0; i < 32; i++) {
            EpochMatchWinner = 1 + uint32(team) * 10 + uint32(betEpoch) * 1000;
            EpochMatchWinnerOutput[EpochMatchWinner] = 1;
            EpochMatchWinner = uint32(team) * 10 + uint32(betEpoch) * 1000;
            EpochMatchWinnerOutput[EpochMatchWinner] = 1;
        }
        // moves betEpoch up so all LPs are 'vested' and can withdraw
        betEpoch += 100;
    }

    function transmitInit(
        string[32] memory _teamSchedule,
        uint32[32] memory _startTime,
        uint32[32] memory _decOdds
    ) external onlyAdmin {

        for (uint8 i = 0; i < 32; i++) {
            matches[i].decOdds = _decOdds[i];
            matches[i].startTime = _startTime[i];
            matches[i].teamSchedule=_teamSchedule[i];
            matches[i].long[0]=0;
            matches[i].long[1]=0;
            matches[i].payoff[0]=0;
            matches[i].payoff[1]=0;
        }
        // initially the schedule, start times, and odds are supplied all at once
        // in the rare case that the schedule or start times must be adjusted, it would be through another submission
        // of all this data, which is costly in terms of gas, but should be rare
    }

    // incrementally, odds will be adjusted, though the schedule and start times will not be
    function transmitOdds(uint32[32] memory _decOdds) external onlyAdmin {
         for (uint8 i = 0; i < 32; i++) {
            matches[i].decOdds = _decOdds[i];
        }
    }

    function adjustParams(uint32 _maxPos) external onlyAdmin {
        concentrationLimit = _maxPos;
    }

    // these show methods are to make it easier for the web front end to process data
    // pulling arrays from solidity
    function showLongs(uint8 _pick) external view returns (uint32[32] memory) {
        uint32[32] memory outLongs;
        for (uint8 i = 0; i < 32; i++) {
            outLongs[i] = matches[i].long[_pick];
        }
        return outLongs;
    }

    function showPayout(uint32 _pick) external view returns (uint32[32] memory) {
        uint32[32] memory outPayoff;
        for (uint8 i = 0; i < 32; i++) {
            outPayoff[i] = matches[i].payoff[_pick];
        }
        return outPayoff;
    }

    // this makes it easy for programs to check if a prior bet is redeemable
    function checkRedeem(bytes32 _subkID) external view returns (bool) {
        Subcontract storage k = subcontracts[_subkID];
        uint32  EpochMatchWinner = uint32(k.pick) + uint32(k.matchNum) * 10 + uint32(k.epoch) * 1000;
        bool redeemable = (EpochMatchWinnerOutput[EpochMatchWinner] > 0 || offercontracts[_subkID].betAmount > 0);
        return redeemable;
    }


    // odds are loaded for the Favorite team/player,
    // the Underdog odds calculated using this function
    function odds(uint8 _match, uint32 _player)
        internal
        view
        returns (uint32)
    {
        uint32 betOdds = matches[_match].decOdds;
        if (_player == 1 && betOdds <9999) {
            betOdds = 1e6 / (45 + betOdds) - 45;
        }
        return betOdds;
    }
/*
    function showDecimalOdds() external view returns (uint32[32] memory) {
        return decOdds;
    }

    function showSchedString() external view returns (string[32] memory) {
        return teamSchedule;
    }

    function showStartTime() external view returns (uint32[32] memory) {
        return startTime;
    }
*/
    function multiply(uint32 a, uint32 b) internal pure returns (uint32) {
        uint32 c = a * b;
        require(c / a == b, "mult overflow");
        return c;
    }

    function subtract(uint32 a, uint32 b) internal pure returns (uint32) {
        require(b <= a, "underflow");
        uint32 c = a - b;
        return c;
    }

    function add(uint32 a, uint32 b) internal pure returns (uint32) {
        uint32 c = a + b;
        require(c >= a && c >= b, "overflow");
        return c;
    }

    // this is used for calculating required margin
    function maxZero(int32 a, int32 b) internal pure returns (int32) {
        int32 c = a >= b ? a : b;
        if (c <= 0) c = 0;
        return c;
    }

}
