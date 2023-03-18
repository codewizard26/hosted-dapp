import {initializeConnector} from '@web3-react/core'
import {MetaMask} from '@web3-react/metamask'
import {WalletConnect} from '@web3-react/walletconnect'
import UAuth from '@uauth/js'
import {UAuthConnector} from '@uauth/web3-react'

UAuthConnector.registerUAuth(UAuth);

const metaMask = initializeConnector((actions) => new MetaMask({ actions }));
const uri = window.location.origin

const walletConnect = initializeConnector(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        rpc: {1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`},
        qrcode: true,
      },
    })
)

const uauth = initializeConnector(
  (actions) => new UAuthConnector({
    actions,
    options: {
      clientID: process.env.REACT_APP_CLIENT_ID,
      redirectUri: uri,
      scope: 'openid wallet',

      connectors: {injected: metaMask[0], walletconnect: walletConnect[0]}
    },
  })
)



const connectors = {
    "UAuth": uauth,
    "MetaMask": metaMask,
    "WalletConnect": walletConnect,
  }
  
  export default connectors