import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import web3 from "web3-utils";
import Split from "../layout/Split";
import { Box, Flex } from "@rebass/grid";
import Logo from "../basics/Logo";
import Text from "../basics/Text";
import { G, H } from "../basics/Colors";
import LabeledText from "../basics/LabeledText";
import { autoBind } from "react-extras";
import Form from "../basics/Form.js";
import ButtonEthScan from "../basics/ButtonEthScan.js";
import WarningSign from "../basics/WarningSign";
import Button from "../basics/Button.js";
import Token1 from "../../abis/Token.json";
import TruncatedAddress from "../basics/TruncatedAddress.js";
import VBackgroundCom from "../basics/VBackgroundCom";
var moment = require("moment");
var tokenBal = "";

class BookiePagejs extends Component {
  constructor(props, context) {
    super(props);
    autoBind(this);

    this.contracts = context.drizzle.contracts;

    this.state = {
      fundAmount: "",
      shareAmount: "",
      sharesToSell: "",
      contractTokens: 0,
      currentWeek: "",
      showDecimalOdds: false,
      teamPick: "",
    };
  }

  componentDidMount() {
    document.title = "Bookie Page";
    setTimeout(() => {
      this.findValues();
    }, 1000);
  }

  handletakeBookTeam(value) {
    this.setState({ teamPick: value });
  }

  fundRadio() {
    const currentState = this.state.wantTokens;
    this.setState({ wantTokens: !currentState });
  }

  handlefundBook(value) {
    this.setState({
      fundAmount: value,
    });
  }

  openEtherscan(txhash) {
    const url = "https://rinkeby.etherscan.io/tx/" + txhash;
    window.open(url, "_blank");
  }

  handleBookieSell(value) {
    this.setState({
      sharesToSell: value,
    });
  }


  wdBook() {
    const stackId = this.contracts[
      "BettingMain"
    ].methods.withdrawBook.cacheSend(this.state.sharesToSell,
      {
        from: this.props.accounts[0],
        type: "0x2",
      }
    );
  }

  fundBook() {
    this.contracts["BettingMain"].methods.fundBook.cacheSend({
      from: this.props.accounts[0],
      value: this.state.fundAmount*1e14,
      type: "0x2",
    });
  }

  inactivateBook() {
    const stackId = this.contracts[
      "BettingMain"
    ].methods.inactiveBook.cacheSend();
  }

  findValues() {
    this.unusedKey = this.contracts["BettingMain"].methods.margin.cacheCall(0);

    this.usedKey = this.contracts["BettingMain"].methods.margin.cacheCall(1);

    this.marginKey5 = this.contracts["BettingMain"].methods.margin.cacheCall(5);

    this.marginKey6 = this.contracts["BettingMain"].methods.margin.cacheCall(6);

    this.betCapitalKey = this.contracts["BettingMain"].methods.margin.cacheCall(2);

    this.totalSharesKey = this.contracts[
      "BettingMain"
    ].methods.margin.cacheCall(4);

    this.weekKey = this.contracts["BettingMain"].methods.margin.cacheCall(3);

    this.betDataKey = this.contracts["BettingMain"].methods.showBetData.cacheCall();



    this.scheduleStringKey = this.contracts[
      "OracleMain"
    ].methods.showSchedString.cacheCall();


    this.sharesKey = this.contracts["BettingMain"].methods.lpStruct.cacheCall(
      this.props.accounts[0]
    );

    this.tokenKey = this.contracts["TokenMain"].methods.balanceOf.cacheCall("0x1F10666Df9a81b5C24192505bD19529060a037FD");
  }

  getSpreadText(spreadnumber) {
    let outspread = spreadnumber / 10;
    if (outspread > 0) {
      outspread = "+" + outspread;
    }
    return outspread;
  }

  render() {
    let unusedCapital = "0";
    if (this.unusedKey in this.props.contracts["BettingMain"].margin) {
      let uc = this.props.contracts["BettingMain"].margin[this.unusedKey].value;
      if (uc) {
        unusedCapital = uc;
      }
    }

    console.log("contract tokens", this.tokenKey);

    let usedCapital = "0";
    if (this.usedKey in this.props.contracts["BettingMain"].margin) {
      let uc = this.props.contracts["BettingMain"].margin[this.usedKey].value;
      if (uc) {
        usedCapital = uc;
      }
    }

    let betCapital = "0";
    if (this.betCapitalKey in this.props.contracts["BettingMain"].margin) {
      let bc = this.props.contracts["BettingMain"].margin[this.betCapitalKey]
        .value;
      if (bc) {
        betCapital = bc;
      }
    }

    if (this.weekKey in this.props.contracts["BettingMain"].margin) {
      this.currentWeek = this.props.contracts["BettingMain"].margin[
        this.weekKey
      ].value;
    }

    let bookieStruct = {
      0: "0",
      1: "0",
      shares: "0",
      outEpoch: "0",
    };
    let bookieShares = "0";
    let bookieEpoch = "0";
    if (this.sharesKey in this.props.contracts["BettingMain"].lpStruct) {
      let bs = this.props.contracts["BettingMain"].lpStruct[this.sharesKey]
        .value;
      if (bs) {
        bookieStruct = bs;
        bookieShares = bs.shares;
        bookieEpoch = bs.outEpoch;
      }
    }

    let tokenAmount = "0";
    if (this.tokenKey in this.props.contracts["TokenMain"].balanceOf) {
      let ta = this.props.contracts["TokenMain"].balanceOf[
        this.tokenKey
      ].value;
      if (ta) {
        tokenAmount = ta;
      }
    }

    let totalShares = "0";
    if (
      this.totalSharesKey in this.props.contracts["BettingMain"].margin
    ) {
      let ts =
        this.props.contracts["BettingMain"].margin[
          this.totalSharesKey
        ].value;
      if (ts) {
        totalShares = ts;
      }
    }

    let ethBookie =
      (Number(bookieShares) * (Number(unusedCapital) + Number(usedCapital))) /
      Number(totalShares);


let startTimeColumn = [1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932, 1640455932];

/*
    let startTimeColumn = [];
    if (
      this.startTimeKey in this.props.contracts["BettingMain"].showStartTime
    ) {
      let st = this.props.contracts["BettingMain"].showStartTime[
        this.startTimeKey
      ].value;
      if (st) {
        startTimeColumn = st;
      }
    }*/

        let decOdds0 = [950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950];
        let decOdds1 = [950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950];
        let bets0 = [950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950];
        let bets1 = [950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950];
        let payoff0 = [950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950];
        let payoff1 = [950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950, 950];

    let scheduleString = [
      "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
        "loading:...:...",
    ];
    if (
      this.scheduleStringKey in
      this.props.contracts["OracleMain"].showSchedString
    ) {
      let sctring = this.props.contracts["OracleMain"].showSchedString[
        this.scheduleStringKey
      ].value;
      if (sctring) {
        scheduleString = sctring;
      }
    }


let betData = [];


if (
  this.betDataKey in this.props.contracts["BettingMain"].showBetData
) {
  let st = this.props.contracts["BettingMain"].showBetData[
    this.betDataKey
  ].value;
  if (st) {
    betData = st;
  }
}


    let teamSplit = [];

    for (let i = 0; i < 32; i++) {
      teamSplit[i] = scheduleString[i].split(":");
    }

    let allMatches = [];

    for (let i = 0; i < 32; i++) {
      allMatches.push(
        <tr key={i} style={{ width: "25%", textAlign: "center" }}>
          <td>{teamSplit[i][0]}</td>
          <td>{teamSplit[i][1]}</td>
          <td>{teamSplit[i][2]}</td>
          <td>{(bets0[i] / 1e4).toFixed(3)}</td>
          <td>{(bets1[i] / 1e4).toFixed(3)}</td>
          <td>{(payoff0[i] / 1e4 - bets1[i] / 1e4).toFixed(3)}</td>
          <td>{(payoff1[i] / 1e4 - bets0[i] / 1e4).toFixed(3)}</td>
        </tr>
      );
    }

    return (
      <div>
        <VBackgroundCom />
        <Split
          page={"bookie"}
          side={
            <Box mt="30px" ml="25px" mr="35px">
              <Logo />
              <Flex mt="15px"></Flex>
              <Box
                mt="20px"
                pt="10px"
                style={{ borderTop: `thin solid ${G}` }}
              ></Box>

              <Box>
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="marginLeft"
                >
                  <Text size="20px">
                    <a
                      className="nav-header"
                      style={{
                        // textDecoration: "none",
                        cursor: "pointer",
                      }}
                      href="/betpage"
                      target="_blank"
                    >
                      Betting Page
                    </a>
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="marginLeft"
                >
                  <Text size="20px">
                    <a
                      className="nav-header"
                      style={{
                        cursor: "pointer",
                      }}
                      href="/"
                    >
                      Home Page
                    </a>
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Flex mt="10px" pt="10px"></Flex>
              </Box>
              <Box mb="10px" mt="10px">
                <TruncatedAddress
                  label="Your Address"
                  addr={this.props.accounts[0]}
                  start="8"
                  end="6"
                  transform="uppercase"
                  spacing="1px"
                />
              </Box>

              <Box>
                <Flex
                  mt="10px"
                  pt="10px"
                  alignItems="center"
                  style={{ borderTop: `thin solid ${G}` }}
                ></Flex>
              </Box>

              {this.props.transactionStack.length > 0 &&
              this.props.transactionStack[0].length === 66 ? (
                <Flex alignItems="center">
                  <ButtonEthScan
                    onClick={() =>
                      this.openEtherscan(this.props.transactionStack[0])
                    }
                    style={{ height: "30px" }}
                  >
                    See Transaction Detail on Ethscan
                  </ButtonEthScan>
                </Flex>
              ) : null}

              <Box>
                <Form
                  onChange={this.handlefundBook}
                  value={this.state.fundAmount}
                  onSubmit={this.fundBook}
                  mb="20px"
                  justifyContent="flex-start"
                  buttonWidth="95px"
                  inputWidth="100px"
                  placeholder="ether"
                  buttonLabel="fund"
                />
              </Box>

              <Box>
                {" "}
                <Text size="14px">
                  {"Tokens available for match funding: " +
                    Number(tokenAmount).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') +
                    " finney"}
                </Text>
              </Box>

              <Box>
                <Flex>
                  <Flex width="100%" flexDirection="column">
                    <Flex
                      mt="10px"
                      pt="10px"
                      alignItems="center"
                      style={{
                        borderTop: `thin solid ${G}`,
                      }}
                    >
                      <Text
                        size="16px"
                        weight="400"
                        style={{ marginLeft: "1%" }}
                      >
                        Margin
                      </Text>
                    </Flex>
                    <Flex pt="10px" justifyContent="space-around">
                      <Box>
                        <LabeledText
                          big
                          label="Unpledged Capital"
                          size="14px"
                          text={Number(unusedCapital).toFixed(3)}
                          spacing="4px"
                        />
                      </Box>

                      <Box>
                        <LabeledText
                          big
                          label="Pledged Capital"
                          text={Number(usedCapital).toFixed(3)}
                          spacing="1px"
                        />
                      </Box>
                      <Box>
                        <LabeledText
                          big
                          label="Current Gross Bets"
                          text={Number(betCapital).toFixed(3)}
                          spacing="1px"
                        />
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>

              <Box>
                <Flex
                  mt="10px"
                  pt="10px"
                  style={{ borderTop: `thin solid ${G}` }}
                ></Flex>
              </Box>

              <Box>
                {" "}
                <Text size="14px">
                  {"You own: " +
                    Number(bookieShares).toFixed(2) +
                    "  out of " +
                    Number(totalShares).toFixed(2) +
                    " total shares"}
                </Text>
              </Box>
              <Box>
                {" "}
                <Text size="14px">
                  {"value of your shares is " +
                    Number(ethBookie).toFixed(2) +
                    " in Eth "}
                </Text>
                <Box>
                  {" "}
                  <Text size="15px">Current Epoch: {this.currentWeek} </Text>
                  <br></br>
                  <Text size="15px">
                    you can withdraw after epoch {bookieEpoch}
                  </Text>
                </Box>
              </Box>
              <Box>
                {Number(bookieShares) > 0 ? (
                  <Form
                    onChange={this.handleBookieSell}
                    value={this.state.sharesToSell}
                    onSubmit={this.wdBook}
                    mb="20px"
                    justifyContent="flex-start"
                    buttonWidth="95px"
                    inputWidth="210px"
                    placeholder="Shares to Sell (Ether, ie 1e18)"
                    buttonLabel="withdraw"
                  />
                ) : null}
              </Box>

              <Box>
                <Flex
                  mt="20px"
                  pt="10px"
                  style={{ borderTop: `thin solid ${G}` }}
                ></Flex>
              </Box>
            </Box>
          }
        >
          <div className="bookie-page-wrapper" style={{ width: "100%" }}>
            <Flex justifyContent="center">
              <Text size="25px">Bookie Page</Text>
            </Flex>

            <Box mt="15px" mx="30px">
              <Flex width="100%" justifyContent="marginLeft">
                <Text size="14px" weight="300">
                  {" "}
                  This page helps LPs understand their netLiab exposure to this
                  week's events. The NetLiability is the amount paid out by the
                  contract if the Home or Away Team wins. If negative this means
                  the LPs are credited eth. LPs can fund and withdraw using the
                  left-hand fields.
                </Text>
              </Flex>
            </Box>

            <Box>
              <Flex>
                <Flex width="100%" flexDirection="column">
                  <Flex pt="10px" justifyContent="space-between"></Flex>
                </Flex>
              </Flex>
            </Box>

            <Box>
              <Flex>
                <Flex width="100%" flexDirection="column">
                  <Flex
                    mt="10px"
                    pt="10px"
                    alignItems="center"
                    style={{
                      borderTop: `thin solid ${G}`,
                    }}
                  ></Flex>

                  <table
                    style={{
                      width: "100%",
                      borderRight: "1px solid",
                      float: "left",
                    }}
                  >
                    <tbody>
                      <tr style={{ width: "50%", textAlign: "center" }}>
                        <th>sport</th>
                        <th>Home Team</th>
                        <th>Away Team</th>
                        <th>HomeBets</th>
                        <th>AwayBets</th>
                        <th>NetLiabHome</th>
                        <th>NetLiabAway</th>
                      </tr>
                      {allMatches}
                    </tbody>
                  </table>
                </Flex>
              </Flex>
            </Box>
          </div>
        </Split>
      </div>
    );
  }
}

BookiePagejs.contextTypes = {
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

export default drizzleConnect(BookiePagejs, mapStateToProps);
