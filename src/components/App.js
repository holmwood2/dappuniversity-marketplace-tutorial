import React, { Component } from 'react';
import Navbar from './Navbar'
import Marketplace from '../abis/Marketplace.json'
import logo from '../logo.png';
import './App.css';
import { ethers } from "ethers";

class App extends Component {

  async loadBlockchainData() {
  // Load provider and account
    this.provider = new ethers.providers.Web3Provider(window.ethereum)
    this.signer = this.provider.getSigner()

    const account = await this.signer.getAddress()
    this.setState({account})
    // Would be good to figure out a way to utilize the provider connection.
    const rpcProvider = new ethers.providers.JsonRpcProvider(
      'HTTP://127.0.0.1:7545');

    // The network ID is not guaranteed to be the same as ChainID, and ethers
    // only provides the latter.
    const networkId = await rpcProvider.send('net_version')
    this.marketplace = new ethers.Contract(
      Marketplace.networks[networkId].address,
      Marketplace.abi,
      this.signer)
    console.log((await this.marketplace.productCount()).toString())
  }
  
	async componentWillMount() {
    await this.loadBlockchainData()
	}

  constructor(props) {
    super(props)
    this.provider = null
    this.signer = null
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
  }
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
