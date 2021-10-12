// SPDX-License-Identifier: MIT

pragma solidity ^0.7.4;
pragma experimental ABIEncoderV2;

import "./Token.sol";
import "./Betting.sol";


contract Oracle {
    // after each settlement, a new epoch commences. Bets cannot consummate on games referring to prior epochs
    // This is true if there is a proposal under consideration, other proposals are not allowed while a current proposal
    // is under review: 0 null, 1 init, 2 odds, 3 settle
    // this tracking number is for submissions, needed for tracking whether someone already voted on a data proposal
    // incremented at each processing
    // timer is used so that each proposal has at least a 5 hours for voters to respond
    // tracks the current local token balance of active oracle contract administrators, as
    // documented by the deposit of their tokens within this contract
    // A proposal goes through via a simple rule of more yes than no votes. Thus, a trivial vote does not need more yes votes
    // if a troll rejects a vote that has few Yes votes, a vote later than evening takes a large bond amount, so
    // and submitters should anticipate such an event
    // 0 betEpoch, 1 reviewStatus, 2 propNumber, 3 timer, 4 totKontract Tokens, 5 yesVotes, 6 noVotes, 7 feePool
    uint32[8] public params;
    // propStartTime in UTC is used to stop active betting. No bets are taken after this time.
    uint128[32] public propOddsStarts;
    uint8[32] public propResults;
    /** the schedule is a record of "sport:home:away", such as "NFL:NYG:SF" for us football, New York Giants vs San Francisco */
    string[32] public matchSchedule;
    // keeps track of those who supplied data proposals. Proposers have to deposit tokens as a bond, and if their
    // proposal is rejected, they lose that bond.
    address public proposer;
    mapping(address => AdminStruct) public adminStruct;
    // this allows the contract to send the tokens
    Token public token;
    // link to communicate with the betting contract
    Betting public bettingContract;
    uint32 public constant CURE_TIME = 5 hours;
    uint32 public constant HOUR_START = 0;
    uint32 public constant MIN_SUBMIT = 5e7;

    // tokens are held in the custody of this contract. Only tokens deposited in this contract can
    // be used for voting or for claiming oracle ether. Note these tokens are owned by the oracle contract while deposited
    // as far as the ERC-20 contract is concerned, but they are credited to the token depositors within this contract
    // voteTrackr keeps track of the proposals in this contract, so that token holders can only vote once for each proposal
    // with the tokens they have in this contract. initFeePool references the start date to allocate correct oracleDiv
    // token revenue
    struct AdminStruct {
        uint32 tokens;
        uint32 voteTracker;
        uint32 initFeePool;
    }

    event ResultsPosted(
        bool indexed posted,
        uint32 epoch,
        uint32 propnum,
        uint8[32] winner,
        address proposer
        );

    event BetDataPosted(
        bool indexed posted,
        uint32 epoch,
        uint32 propnum,
        uint128[32] oddsStart,
        address proposer
        );

    event ParamsPosted(
        uint32 concLimit,
        uint32 epoch,
        address proposer
    );

    event SchedulePosted(
        bool indexed posted,
        uint32 epoch,
        uint32 propnum,
        string[32] sched,
        address proposer
        );

    event Funding(
        uint32 tokensChange,
        uint etherChange,
        address transactor
    );

    constructor(address payable bettingk, address _token) {
        bettingContract = Betting(bettingk);
        token = Token(_token);
        params[3] = 2e9;
        params[0] = 1;
        params[2] = 1;
    }

    function vote(bool _sendData) external {
        // voter must have votes to allocate
        require(adminStruct[msg.sender].tokens > 0);
        // can only vote if there is a proposal
        require(params[1] != 0);
        // voter must not have voted on this proposal
        require(adminStruct[msg.sender].voteTracker != params[2]);
        // this prevents this account from voting again on this data proposal (see above)
        adminStruct[msg.sender].voteTracker = params[2];
        // votes are simply one's entire token balance deposited in this oracle contract
        if (_sendData) {
            params[5] += adminStruct[msg.sender].tokens;
        } else {
            params[6] += adminStruct[msg.sender].tokens;
        }
    }

    receive() external payable {}

    function initPost(
        string[32] memory _teamsched,
        uint32[32] memory _starts,
        uint32[32] memory _decimalOdds
        ) external {
        // this requirement makes sure a post occurs only if there is not a current post under consideration, or
        // it is an amend for an earlier post with these data
        require(params[1] == 0, "Already under Review");
        propOddsStarts = create128(_decimalOdds, _starts);
        params[1] = 1;
        post();
        matchSchedule = _teamsched;
        // this tells users that an inimtial proposal has been sent, which is useful
        // for oracle administrators who are monitoring this contract
        emit SchedulePosted(false, params[0], params[2], _teamsched, msg.sender);
        emit BetDataPosted(false, params[0], params[2], propOddsStarts, msg.sender);
    }

    function updatePost(
        uint32[32] memory _starts,
        uint32[32] memory _decimalOdds
        ) external {
        require(params[1] == 0, "Already under Review");
        params[1] = 2;
        post();
        propOddsStarts = create128(_decimalOdds, _starts);
        emit BetDataPosted(false, params[0], params[2], propOddsStarts, msg.sender);
    }

    function settlePost(uint8[32] memory _resultVector) external {
        // this prevents a settle post when other posts have been made
        require(params[1] == 0, "Already under Review");
        params[1] = 3;
        post();
        propResults = _resultVector;
        emit ResultsPosted(false, params[0], params[2], propResults, msg.sender);
    }

    function initProcess() external {
        // this prevents an odds or results proposal from  being sent
        require(params[1] == 1, "wrong data");
        // needs at least 5 hours
        require (block.timestamp > params[3], "too soon");
        // only sent if 'null' vote does not win
        if (params[5] > params[6]) {
            // sends to the betting contract
            bettingContract.transmitInit(propOddsStarts
            );
            emit BetDataPosted(true, params[0], params[2], propOddsStarts, proposer);
            emit SchedulePosted(true, params[0], params[2], matchSchedule, proposer);
        }
        // resets various data (eg, params[3])
        reset();
    }

    // these have the same logic as for the initProcess, just for the different datasets
    function updateProcess() external {
        // this prevents an 'initProcess' set being sent as an odds transmit
        require(params[1] == 2, "wrong data");
        // needs at least 5 hours
        require (block.timestamp > params[3], "too soon");
        if (params[5] > params[6]) {
            bettingContract.transmitUpdate(propOddsStarts);
            emit BetDataPosted(true, params[0], params[2], propOddsStarts, proposer);
        }
        reset();
    }

    function settleProcess() external {
        require(params[1] == 3, "wrong data");
        // needs at least 5 hours
        require (block.timestamp > params[3], "too soon");
        uint ethDividend;
        uint32 _epoch;
        if (params[5] > params[6]) {
            (_epoch, ethDividend) = bettingContract.settle(propResults);
            params[0] = uint8(_epoch);
            emit ResultsPosted(true, params[0], params[2], propResults,  proposer);
            params[7] += uint32(ethDividend) / params[4];
        }
        reset();
    }

    function paramUpdate(uint32 _concentrationLim) external {
        // In the first case, an immediate send allows a simple way to protect against stale odds
        // a high minimum bet would prevent new bets while odds are voted upon
        // in the second case, a large token holder can , "Low Balance");
        require(adminStruct[msg.sender].tokens >= 5e7);
        bettingContract.adjustParams(_concentrationLim);
        emit ParamsPosted(
            _concentrationLim,
            params[0],
            msg.sender
        );
    }

    function withdrawTokens(uint32 _amtTokens) external {
        require(_amtTokens <= adminStruct[msg.sender].tokens,
            "need tokens"
        );
        // this prevents voting more than once or oracle proposals with token balance.
        require(params[1] == 0, "no wd during vote");
          uint ethClaim = uint((params[7] - adminStruct[msg.sender].initFeePool )  * adminStruct[msg.sender].tokens);
        adminStruct[msg.sender].initFeePool = params[7];
        params[4] -= _amtTokens;
        adminStruct[msg.sender].tokens -= _amtTokens;
        uint ethSend = ethClaim;
        payable(msg.sender).transfer(ethSend);
        token.transfer(msg.sender, _amtTokens);
        emit Funding(_amtTokens, ethClaim, msg.sender);
    }

    function depositTokens(uint32 _amt) external {
        if (adminStruct[msg.sender].tokens > 0) {
            //uint userTokens = adminStruct[msg.sender].tokens;
            uint ethClaim = uint((params[7] - adminStruct[msg.sender].initFeePool ) * adminStruct[msg.sender].tokens);
            payable(msg.sender).transfer(ethClaim);
            }
        token.transferFrom(msg.sender, address(this), _amt);
        adminStruct[msg.sender].tokens += _amt;
        params[4] += _amt;
        adminStruct[msg.sender].initFeePool = params[7];
        emit Funding(_amt, 0, msg.sender);
      }

      function showSchedString() external view returns (string[32] memory) {
        return matchSchedule;
    }

    function post() internal {
        // constraining the hourOfDay to be > 10 gives users a block of time where they can be confident that their
        // inattention to the contract poses no risk of a malicious data submission.
        require(hourOfDay() >= HOUR_START, "hour");
        // this ensures only significant token holders are making proposals, blocks trolls
        require(adminStruct[msg.sender].tokens >= MIN_SUBMIT, "Low Balance");
        params[3] = uint32(block.timestamp) + CURE_TIME;
        params[5] = adminStruct[msg.sender].tokens;
        // If strict majority of total tokens, time delay irrelevant
        if (adminStruct[msg.sender].tokens > 5e8) params[3] = 0;
        // this prevents proposer from voting again with his tokens on this submission
        adminStruct[msg.sender].voteTracker = params[2];
        proposer = msg.sender;
    }

    function reset() internal {
        delete proposer;
        params[5] = 0;
        params[6] = 0;
        params[1] = 0;
        params[2]++;
        params[3] = 0;
    }

     function create128(uint32[32] memory e, uint32[32] memory g) internal pure returns (uint128[32] memory outv) {
         uint32 f;
         uint128 out;
         for (uint i = 0; i < 32; i++) {
             require (e[i] > 100 && e[i] < 9999);
             f = 1e6 / (41 + e[i]) - 41;
            out |= uint128(e[i]) << 96;
            out |= uint128(f) << 64;
            out |= uint128(g[i]);
           outv[i] = out;
           delete out;
         }
         }

    // this is used so users do not have to delegate someone else to monitor the contract 24/7
    // 86400 is seconds in a day, and 3600 is seconds in an hour
    // restricts contract submission to between 5am-8pm in summer, 6am-9pm in winter
    function hourOfDay() public view returns (uint hour1) {
        hour1 = (block.timestamp - 7600) % 86400 / 3600;
    }
}
