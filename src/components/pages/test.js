/**
 * Unpacks a uint256 described  as a str
 * @param {string} src
 *
 * example:
 *  unpack256("3316073442921887087233494075908471683470175455855365896090794942529659");
 *  returns: [123, 456, 789, 123, 456, 789,   0, 123 ]
 */

 import React, { Component } from "react";
 // test
 import { drizzleConnect } from "@drizzle/react-plugin";
 import PropTypes from "prop-types";
 import Split from "../layout/Split";
 //import web3 from "web3-utils";
 import web3 from "web3-utils";
 import { Box, Flex } from "@rebass/grid";
 import Logo from "../basics/Logo";
 import Text from "../basics/Text";
 import Form from "../basics/Form.js";
 import { G } from "../basics/Colors";
 import { autoBind } from "react-extras";
 import ButtonEthScan from "../basics/ButtonEthScan.js";
 import Input from "../basics/Input.js";
 import Button from "../basics/Button.js";
 import ButtonI from "../basics/ButtonI.js";
 import TruncatedAddress from "../basics/TruncatedAddress.js";
 import VBackgroundCom from "../basics/VBackgroundCom";
 import BettingContract from "../../abis/Betting.json";
 import OracleContract from "../../abis/Oracle.json";
 import TokenContract from "../../abis/Token.json";
//import BN from "web3";
 var moment = require("moment");
 //var Web3 = require("web3");

 class BetPagejs extends Component {
   constructor(props, context) {
     super(props);
     autoBind(this);
     this.contracts = context.drizzle.contracts;
 //import bn from 'bn";
function unpack256(src) {
//  const web3b = this.context.drizzle.web3;
const bn = new web3.BN(src);
const str = bn.toString(16);
const pieces = str
  .match(/.{1,2}/g)
  .reverse()
  .join("")
  .match(/.{1,8}/g)
  .map((s) =>
    s
      .match(/.{1,2}/g)
      .reverse()
      .join("")
  );
const ints = pieces.map((s) => parseInt("0x" + s)).reverse();
return ints;
}

/** Testing Code  */

var constweb3 = require("web3");
const src =
  //   "3316073440404769290352536979476828745307069448524228924342875165060240";
  "3316073442921887087233494075908471683470175455855365896090794942529659";
console.log(unpack256(src));

}
}

BetPagejs.contextTypes = {
drizzle: PropTypes.object,
};

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = (state) => {
return {
  accounts: state.accounts,
  contracts: state.contracts,
  drizzleStatus: state.drizzleStatus,
  transactions: state.transactions,
  transactionStack: state.transactionStack,
};
};

export default drizzleConnect(BetPagejs, mapStateToProps);
