import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import { autoBind } from "react-extras";
import Text from "../basics/Text";
import IndicatorD from "../basics/IndicatorD";
import Betting from "../../abis/Betting.json";
var moment = require("moment");
var momentTz = require("moment-timezone");


class EventBetRecord extends Component {
  constructor(props, context) {
    super(props);
    autoBind(this);


    this.currentContract = this.props.routeParams.contract;
    this.contracts = context.drizzle.contracts;
    this.drizzle = context.drizzle;
    this.priceHistory = {};
  }

  componentDidMount() {
    document.title = "Bet Event Logs";
      this.getRegBets();
  }

  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = date + "/" + month + "/" + year + " " + hour + ":" + min;
    return time;
  }

  getRegBets() {
    const web3 = this.context.drizzle.web3;
    const contractweb3 = new web3.eth.Contract(Betting.abi, Betting.address);
    var pricedata = [];
    contractweb3
      .getPastEvents("BetRecord", {
        fromBlock: 9300000,
        toBlock: 'latest'
      })
      .then(
        function (events) {
          events.forEach(function (element) {
            pricedata.push({
              timestamp: element.blockNumber,
              Epoch: element.returnValues.epoch,
              Offer: Boolean(element.returnValues.offer),
              BetSize: element.returnValues.betsize,
              LongPick: element.returnValues.pick,
              MatchNum: element.returnValues.matchnum,
              Payoff: element.returnValues.payoff,
              Hashoutput: element.returnValues.contractHash,
              BettorAddress: element.returnValues.bettor,
            });
          }, this);
          this.priceHistory = pricedata;
        }.bind(this)
      );
  }

  openEtherscan() {
    const url =
      "https://rinkeby.etherscan.io/address/0x131c66DC2C2a7D1b614aF9A778931F701C4945a1";
    window.open(url, "_blank");
  }

  render() {
    console.log("phist", this.priceHistory);
    if (Object.keys(this.priceHistory).length === 0)
      return (
        <Text size="20px" weight="200">
          Waiting...
        </Text>
      );
    else {
      return (
        <div>
          <IndicatorD
            className="etherscanLink"
            size="15px"
            mr="10px"
            mb="10px"
            ml="5px"
            mt="10px"
            width="360px"
            label="See Contract on"
            onClick={() => this.openEtherscan()}
            value="Etherscan"
          />
          <Text size="12px" weight="200">
            {" "}
            Time, offer, Epoch, MatchNum, LongPick, Betsize, Payoff, BettorAddress,
            betHash
          </Text>{" "}
          <br />
          {this.priceHistory.map((event) => (
            <div>
              <Text size="12px" weight="200">
                {" "}
                {event.timestamp},{event.Offer},
                {event.Epoch}, {event.MatchNum}, {event.LongPick},
                {event.BetSize},
                {event.BettorAddress}, {event.Hashoutput},{" "}
              </Text>
              <br />
            </div>
          ))}
        </div>
      );
    }
  }
}

EventBetRecord.contextTypes = {
  drizzle: PropTypes.object,
};

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    contracts: state.contracts,
    drizzleStatus: state.drizzleStatus,
  };
};

export default drizzleConnect(EventBetRecord, mapStateToProps);
