
import Betting from './abis/Betting.json'
import Oracle from './abis/Oracle.json';
import Token from './abis/Token.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
       type: 'ws',
       url: 'wss://rinkeby.infura.io/ws/v3/790364983f7a4b8ebb6b0ac344360e57'
    //  type: 'https',
    //  url: 'https://arbitrum-rinkeby.infura.io/v3/8fb974170b1743288e9e6fac3bed68a0'
    }
  },

  contracts: [Betting],
/*  events: {
    Betting: [
      'BetRecord',
      'BetBigRecord'
    ],
    Oracle: [
      'ResultsPosted',
      'DecOddsPosted',
      'SchedulePosted'
    ]
  },*/
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions
