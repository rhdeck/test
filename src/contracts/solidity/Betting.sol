pragma solidity ^0.7.4;
pragma experimental ABIEncoderV2;


/**
SPDX-License-Identifier: MIT
Copyright © 2020 Eric G. Falkenstein
*/

import "./Token.sol";


contract Betting {
    // totalShares is used to monitor an LP's share of LP eth in the contract.
    // These are not tokens, they are just used for uinternal accounting of the LP's percent ownership
    // this is a parameter for a maximum bet exposure.
    //If LP capital is X, X/concentrationLimit is the largest absolute net exposure for any game.
    // this counter is used to make bet IDs unique
        // 0 LP unused capital, 1 LP used Capital, 2 bettor capital
        // 3 betEpoch, 4 totalShares, 5 concentrationLimit, 6 nonce
    uint32[7] public margin;
    //betLong[home/away], betPayout, starttime, odds
    uint256[32] public betData;
    address payable public oracleAdmin;
    // this struct contains the parameters of a bet
    mapping(bytes32 => Subcontract) public subcontracts;
    // this maps the set {epoch, match, team} to its event outcome,
    //where 0 is a loss, 1 is a tie or postponement, 2 a win
    // The outcome defaults to 0, so that these need not be updated for a loss
    mapping(uint32 => uint8) public outcomeMap;
    // This keeps track of an LP's ownership in the LP ether capital,
    // and also when it can first withdraw capital (two settlement periods)
    mapping(address => LPStruct) public lpStruct;
    // this struct holds a user's ETH balance
    mapping(address => uint32) public userBalance;
    // Schedule is a string where Sport:FavoriteTeam:UnderdogTeam
    Token public token;

    struct Subcontract {
        uint8 epoch;
        uint8 matchNum;
        uint8 pick;
        uint32 betAmount;
        uint32 payoff;
        bool offer;
        address bettor;
    }

    struct LPStruct {
        uint32 shares;
        uint32 outEpoch;
    }

    event BetRecord(
        address indexed bettor,
        uint8 indexed epoch,
        uint8 matchNum,
        uint8 pick,
        bool offer,
        uint32 betAmount,
        uint32 payoff,
        bytes32 contractHash
    );

    constructor(address _tokenAddress) {
        margin[5] = 5;
        margin[3] = 1;
        token = Token(_tokenAddress);
    }

    modifier onlyAdmin() {
        require(oracleAdmin == msg.sender);
        _;
    }

    function setOracleAddress(address payable _oracleAddress) external {
        require(oracleAdmin == address(0x0), "Only once");
        oracleAdmin = _oracleAddress;
    }

    receive() external payable {
    }

    function takeRegularBet(
        uint8 _matchNumber,
        uint8 _team0or1,
        uint32 _betAmt
    ) external {
        require(_betAmt <= userBalance[msg.sender], "NSF ");
        (uint32[7] memory betDatav) = decodeNumber(betData[_matchNumber]);
        require(betDatav[6] > block.timestamp, "game started or not playing");
        int32 betPayoff = int32(_betAmt) * int32(betDatav[4 + _team0or1]) / 1000;
        // LP liability if bet team wins
        int32 netPosTeamBet = int32(betDatav[2 + _team0or1]) - int32(betDatav[1 - _team0or1]);
      // check for sufficient capital given bookie pool and diversification param
        require(int32(betPayoff + netPosTeamBet) < int32(margin[0]/margin[5]), "betsize over limit");
        int32 netPosTeamOpp = int32(betDatav[3 - _team0or1]) - int32(betDatav[_team0or1]);
        // net margin change is the change in absolute value of liabities to either contestant
        int32 marginChange = maxZero(int32(betPayoff) + netPosTeamBet, -int32(_betAmt) + netPosTeamOpp) - maxZero(netPosTeamBet, netPosTeamOpp);
        require(marginChange < int32(margin[0] - margin[1]),
            "betsize over unpledged capital"
        );
        userBalance[msg.sender] -= _betAmt;
        bytes32 subkID = keccak256(abi.encodePacked(margin[6], block.timestamp));
        Subcontract memory order;
        order.bettor = msg.sender;
        order.betAmount = _betAmt;
        order.payoff = uint32(betPayoff);
        order.pick = _team0or1;
        order.matchNum = _matchNumber;
        order.epoch = uint8(margin[3]);
        subcontracts[subkID] = order;
        margin[2] += _betAmt;
        margin[1] = uint32(addSafe(margin[1], marginChange));
        betDatav[_team0or1] += _betAmt;
        betDatav[2 + _team0or1] += uint32(betPayoff);
        uint256 encoded;
        encoded |= uint256(betDatav[0]) << 224;
        encoded |= uint256(betDatav[1]) << 192;
        encoded |= uint256(betDatav[2]) << 160;
        encoded |= uint256(betDatav[3]) << 128;
        encoded |= uint256(betDatav[4]) << 96;
        encoded |= uint256(betDatav[5]) << 64;
        encoded |= uint256(betDatav[6]);
        betData[_matchNumber] = encoded;
        margin[6]++;
        emit BetRecord(
            msg.sender,
            uint8(margin[3]),
            _matchNumber,
            _team0or1,
            false,
            _betAmt,
            uint32(betPayoff),
            subkID
        );
      }

    function postBigBet(
        uint8 _matchNum,
        uint8 _team0or1,
        uint32 _betAmount,
        uint32 _decOddsBB
    ) external {
        require(
            _betAmount >= margin[0]/margin[5], "concLimit");
            require(_betAmount <= userBalance[msg.sender],
            "NSF"
        );
        require(_decOddsBB > 1000 && _decOddsBB < 9999, "invalid odds");
        bytes32 subkID = keccak256(abi.encodePacked(margin[6], block.timestamp));
        Subcontract memory order;
        order.pick = _team0or1;
        order.matchNum = _matchNum;
        order.epoch = uint8(margin[3]);
        order.offer = true;
        order.bettor = msg.sender;
        order.betAmount = _betAmount;
        order.payoff = ((_decOddsBB - 1000) * _betAmount) / 1000;
        subcontracts[subkID] = order;
        margin[6]++;
        emit BetRecord(
            msg.sender,
            uint8(margin[3]),
            _matchNum,
            _team0or1,
            true,
            order.betAmount,
            order.payoff,
            subkID
        );
    }

    function takeBigBet(bytes32 _subkid) external {
        Subcontract memory k = subcontracts[_subkid];
        (uint32[7] memory betDatav) = decodeNumber(betData[k.matchNum]);
        require(betDatav[6] > block.timestamp, "game started");
        require(k.epoch == margin[3],"expired bet"
        );
        require(
            userBalance[k.bettor] >= k.betAmount && userBalance[msg.sender] >= k.payoff , "NSF"
        );
        betDatav[k.pick] += k.betAmount;
        betDatav[2 + k.pick] += k.payoff;
        betDatav[1 - k.pick] += k.payoff;
        betDatav[3 - k.pick] += k.betAmount;
        // first we record the offer of the initial bigbet proposer as taken
        userBalance[k.bettor] -= k.betAmount;
        k.offer = false;
        subcontracts[_subkid] = k;
        emit BetRecord(
            k.bettor,
            uint8(margin[3]),
            k.matchNum,
            k.pick,
            false,
            k.betAmount,
            k.payoff,
            _subkid
        );
        // creates new contract for taker of big bet
        bytes32 subkID2 = keccak256(abi.encodePacked(margin[6], block.timestamp));
        k.bettor = msg.sender;
        uint32 temppay = k.payoff;
        k.payoff = k.betAmount;
        k.betAmount = temppay;
        k.pick = 1 - k.pick;
        // payoff of the offered bet is the taker bet amount
        userBalance[msg.sender] -= k.payoff;
        margin[2] += (k.betAmount + temppay);
        emit BetRecord(
            msg.sender,
            uint8(margin[3]),
            k.matchNum,
            k.pick,
            false,
            k.betAmount,
            k.payoff,
            subkID2
        );
        // updates betData to account for new amounts bet and payoffs
        uint256 encoded;
        encoded |= uint256(betDatav[0]) << 224;
        encoded |= uint256(betDatav[1]) << 192;
        encoded |= uint256(betDatav[2]) << 160;
        encoded |= uint256(betDatav[3]) << 128;
        encoded |= uint256(betDatav[4]) << 96;
        encoded |= uint256(betDatav[5]) << 64;
        encoded |= uint256(betDatav[6]);
        betData[k.matchNum] = encoded;
        subcontracts[subkID2] = k;
        margin[6]++;
    }

    function cancelBigBet(bytes32 _subkid) external {
        require(subcontracts[_subkid].bettor == msg.sender, "wrong account");
        require(subcontracts[_subkid].offer, "taken");
        delete subcontracts[_subkid];
    }

    function settle(uint8[32] memory _winner)
        external
        onlyAdmin
        returns (uint32, uint)
        {
            // this is the account tracking the sum of eth owed to bettors (wins and ties)
            // from the initial bet.
            uint32 redemptionPot;
            // this is the account tracking the sum of eth owed to bettors (wins and ties)
            // from the profit from the winning bets
            uint32 payoffPot;
            uint EpochMatchWinner;
            uint winningTeam;
            for (uint i = 0; i < 32; i++) {
                winningTeam = _winner[i];
                    (uint32[7] memory betDatav) = decodeNumber(betData[i]);
                EpochMatchWinner = i * 10 + margin[3] * 1000;
                // if 0 or 1, this represents the Favorite or Underdog as winner, respectively
                if (winningTeam != 2) {
                    redemptionPot += betDatav[winningTeam];
                    payoffPot += betDatav[winningTeam+2];
                  // this unique match&epoch&team hash will map to a win, 2, allowing bettors to claim their winnings
                  // via the redeem method.
                    outcomeMap[uint32(EpochMatchWinner + winningTeam)] = 2;
                } else
                    {
                    // the bettor's subcontract--epoch/match/team--will now map to a tie or 'no contest', coded as 1
                    redemptionPot += (betDatav[0] + betDatav[1]);
                    outcomeMap[uint32(EpochMatchWinner)] = 1;
                    outcomeMap[uint32(1 + EpochMatchWinner)] = 1;
                }
                // the default value of outcomeMap[] is 0, which is like a loss in that bettor gets
                // no eth back, so this mapping need not be assigned
            }
            // this takes all the money bet plus all the bookie capital, and subtracts the payouts
            margin[0] = addSafe(margin[0] + margin[2], - int32(redemptionPot + payoffPot));
            margin[3]++;
            // allocate payout to the oracle. payoff units are in 1e14 so this is 5% of the winnings
            uint256 oracleDiv = 5e12 * uint256(payoffPot);
            oracleAdmin.transfer(oracleDiv);
            // locked amounts are reset to zero for the next epoch for margin calculations
            margin[1] = 0;
            margin[2] = 0;
            delete betData;
            // allows LPs to withdraw and fund again
            betData[0] = 2e9;
            return (margin[3], oracleDiv);
        }

    function fundBettor() external payable {
        uint32 amt = uint32(msg.value / 1e14);
        userBalance[msg.sender] += amt;
    }

    function fundBook() external payable {
        // not allowed when games are played because that game results affect the value of the book's shares
        // not reflected in the house eth value, so when games start, no LP withdrawal or funding is _allowed
        require(block.timestamp < uint32(betData[0]), "only prior to first event");
        uint32 netinvestment = uint32(msg.value / 1e14);
        uint32 _shares = 0;
        if (margin[0] > 0) {
            // investors receive shares marked at fair value, the current shares/eth ratio for all
            // LP's eth in the book is the sum of pledged, margin[1], and unpledged, margin[0], eth
            _shares =  multiply(netinvestment, margin[4]) / margin[0];
        } else {
            _shares = netinvestment;
        }
        margin[0] = addSafe(margin[0], int32(netinvestment));
        lpStruct[msg.sender].outEpoch = margin[3] + 1;
        margin[4] += _shares;
        lpStruct[msg.sender].shares += _shares;
    }

    function redeem(bytes32 _subkId, uint32 _epocmatpick) external {
        require(subcontracts[_subkId].bettor == msg.sender, "wrong account");
        require(!subcontracts[_subkId].offer, "not taken");
        // checks teamEpochHash to see if bet receives money back
          // 0 is for a loss or no outcome reported yet
        require(outcomeMap[_epocmatpick] != 0, "need win or tie");
        // both ties and wins receive back their initial bet amount, so this is the start
        // whether a win or tie
        uint32 payoff = subcontracts[_subkId].betAmount;
        // if a winner, add the payoff amount
        if (outcomeMap[_epocmatpick] == 2) {
            // the oracle revenue comes out of a 5% fee applied to bettor payouts,
            // this is about half of the total vig, which is 5% of bet amount
            payoff += (subcontracts[_subkId].payoff * 95) / 100;
          }
        // adds to the bettor funds account
        delete subcontracts[_subkId];
        userBalance[msg.sender] += payoff;
        if (margin[3] < 20) {
        uint256 tokensOut = payoff * 1e3;
        //uint256 contractTokens = token.balanceOf(address(this));
            if (token.balanceOf(address(this)) >= tokensOut) {token.transfer(msg.sender, tokensOut);}
        }
    }

    function withdrawBettor(uint32 _amt) external {
        require(_amt <= userBalance[msg.sender]);
        userBalance[msg.sender] -= _amt;
        uint256 amt256 = uint256(_amt) * 1e14;
        payable(msg.sender).transfer(amt256);
    }

    function withdrawBook(uint32 _sharesToSell) external {
        // same reason as given above in fundBook
        require(block.timestamp < uint32(betData[0]), "only prior to first event");
        require(lpStruct[msg.sender].shares >= _sharesToSell, "NSF");
        // investors can only cashout after investing for at least 2 epochs, this allows LPs to better anticipate the
        // economics of investing as an LP
        require(margin[3] > lpStruct[msg.sender].outEpoch, "too soon");
        // margin[0] + margin[1] is the total eth amount of the LPs
        uint32 ethWithdraw =
            multiply(_sharesToSell, margin[0]) / margin[4];
        // one can withdraw at any time during the epoch, but only if the LP eth balances that are
        // unpledged, or free, and not acting as collateral
        require(
            ethWithdraw <= (margin[0] - margin[1]),
            "insufficient free capital"
        );
        margin[4] -= _sharesToSell;
        lpStruct[msg.sender].shares -= _sharesToSell;
        margin[0] -= ethWithdraw;
        uint256 ethWithdraw256 = uint256(ethWithdraw) * 1e14;
        payable(msg.sender).transfer(ethWithdraw256);
    }


    function transmitInit(
      uint128[32] memory _oddsAndStart
      ) external onlyAdmin {
          require(margin[2] == 0);
            betData = _oddsAndStart;
      }

    function transmitUpdate(uint128[32] memory _updateBetData) external onlyAdmin {
        for (uint i = 0; i < 32; i++) {
          uint128 x = uint128(betData[i] >> 128);
          betData[i] |= uint256(x) << 128;
          betData[i] += uint256(_updateBetData[i]);
        }
    }

    function adjustParams(uint32 _maxPos) external onlyAdmin {
        margin[5] = _maxPos;
    }

    // this makes it easy for programs to check if a prior bet is redeemable
    function checkRedeem(bytes32 _subkID, uint32 _epocmatpick) external view returns (bool) {
        bool openNow = subcontracts[_subkID].offer;
        bool redeemable = ((outcomeMap[_epocmatpick] > 0 && !openNow)|| openNow);
        return redeemable;
    }

    function showBetData() external view returns (uint256[32] memory) {
        return betData;
    }

    function decodeNumber(uint256 _encoded) internal pure returns (uint32[7] memory vec1 ) {
       vec1[0] = uint32(_encoded >> 224);
       vec1[1] = uint32(_encoded >> 192);
       vec1[2] = uint32(_encoded >> 160);
       vec1[3] = uint32(_encoded >> 128);
       vec1[4] = uint32(_encoded >> 96);
       vec1[5] = uint32(_encoded >> 64);
       vec1[6] = uint32(_encoded);
   }

  function maxZero(int32 a, int32 b) internal pure returns (int32) {
      int32 c = a >= b ? a : b;
      if (c <= 0) c = 0;
      return c;
  }

    function multiply(uint32 _a, uint32 _b) internal pure returns (uint32) {
          uint32 c = _a * _b;
          require(c / _a == _b, "mult overflow");
          return c;
      }

      function addSafe(uint32 _a, int32 _b) internal pure returns (uint32) {
         uint32 c;
          if (_b < 0) {
              c = _a - uint32(-_b);
              require (c < _a, "overflow");
          } else {
              c = _a + uint32(_b);
              require (c >= _a, "overflow");
          }
          return c;
      }

}
