import React, { Component } from 'react';
import Navbar from './Navbar'
import detectEthereumProvider from '@metamask/detect-provider';
import Marketplace from '../abis/Marketplace.json'
import logo from '../logo.png';
import './App.css';


class App extends Component {

	async componentWillMount() {
    const provider = await detectEthereumProvider();
    if (provider) {
      this.loadBlockchainData(provider)
    } else {
      window.alert('Ethereum provider not found - please install metamask')
    }
	}
  async loadBlockchainData(provider) {
    const accounts = await provider.request({ method: 'eth_accounts' })
    console.log(accounts)
    this.setState({account: accounts[0]})
    // const networkId = await web3.eth.net.getId()
    const networkId = await provider.request({ method: 'net_version' })
    const networkData = Marketplace.networks[networkId]
    if (networkData) {
      console.log("marketplace address %s", networkData.address)
    } else {
      window.alert('Marketplace contract not deployed')
    }
  }
  constructor(props) {
    super(props)
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
