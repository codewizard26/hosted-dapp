import React, { Component } from 'react';
import Web3 from 'web3'
import detectEthereumProvider from "@metamask/detect-provider"
import Cryptowiz from './contracts/Cryptowiz.json'
import {MDBCard,MDBCardBody,MDBCardTitle,MDBCardText,MDBCardImage,MDBBtn} from 'mdb-react-ui-kit'
import './App.css';
import Container from './components/Container';

class App extends Component {

 
  

  constructor(props) {
    super(props);
  
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      cryptowiz_arr: [],
      recieverAccount:"",
      token_id:""

    }


  }

  onSubmit = (event) => {
    event.preventDefault(event);
    console.log(event.target.name.value);
    console.log(event.target.email.value);
  };

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    
  }

  //check ethereum provider
  async loadWeb3() {
    const provider = await detectEthereumProvider();

    //modern-browsers

    if (provider) {
      window.web3 = new Web3(provider)
    } else {
      console.log("no wallet detected")
    }
  }


  async loadBlockchainData() {
    const accounts = await window.web3.eth.requestAccounts()
    this.setState({ account: accounts[0] })
    

    const network_id = await window.web3.eth.net.getId()
    const networkData = Cryptowiz.networks[network_id]
    if (networkData) {

      const abi = Cryptowiz.abi;
      const address = networkData.address
      const contract = new window.web3.eth.Contract(abi, address)
      this.setState({ contract })

      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply });
      for (let i = 1; i <= totalSupply; i++) {

        const CryptoWiz = await contract.methods.Cryptowiz(i - 1).call()
        this.setState({
          cryptowiz_arr: [CryptoWiz]

        })

      }
    }
    else {
      console.log('Smart contract not deployed')
    }
  }

  // minting function ....we are sending info and we need to
  //specify info

  mint = (cryptowiz) => {
    this.state.contract.methods.mint(cryptowiz).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({
          cryptowiz_arr: [...this.state.cryptowiz_arr, cryptowiz]
        })
      })
  }

  transfer = (cryptowiz) =>{
    this.state.contract.methods.transferFrom().send()
    alert("tranfer successfull")


  }

  handleClick =() =>{
    console.log("Tranfering NFT")
  }

  render() {
    return (
      
      <div className='container-filed '>
        <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
          <div className='navbar-brand col-sm-3 col-md-3 mr-0 '>
            CryptoWiz NFTs (Non Fungible Tokens)
            <div className='text-right'>Wallet Address : {JSON.parse(localStorage.getItem("username")).value}</div>

          </div>
        </nav>

        <div className='container-fluid mt-2'>
          <div className='row'>
            <main role='main' className='col-lg-12 d-flex text-center'>
              <div className='content mr-auto ml-auto'>
                <h1>Bill NFTs generator ( Dashboard)</h1>

              </div>
            </main>
          </div>

          <form onSubmit={(event) => {
            event.preventDefault()
            let cryptowiz = this.cryptoWiz.value
            this.mint(cryptowiz)
          }} className="text-center">

            <input type='text' placeholder='Add Items Name manually' className=' mt-4 mb-1 ' style={{ padding: .5 + "rem",width:50+'rem'}} ref={(input) => this.cryptoWiz = input} />
            <input type='submit' className="btn btn-primary" style={{ margin: 6 + 'px', padding: .5 + "rem" }} value='MINT' />
          </form>
        </div>

        <hr></hr>
        <div className=' textCenter' style={{display:'flex'}}>
          {this.state.cryptowiz_arr.map((cryptowiz,key) =>{
            return(
              <div key={key}>
                 <div>
                  <MDBCard  className='token img' style={{maxWidth:'22rem'}}>
                  <MDBCardBody className='row'>
                    <MDBCardTitle>Customer Unstoppable Domain-Name :{JSON.parse(localStorage.getItem("username")).value}</MDBCardTitle> 
                    <MDBCardText>{this.state.cryptowiz_arr}</MDBCardText>
                    <Container triggerText="Tranfer NFT" onSubmit={this.onSubmit} />
                  </MDBCardBody>
                  </MDBCard>
                 </div>
              </div>
            )
          })}
        </div>
        

      </div>
    )
  }
}

export default App