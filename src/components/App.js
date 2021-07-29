import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import GoldMarketplace from '../abis/GoldMarketplace.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = GoldMarketplace.networks[networkId]
    if(networkData) {
      const marketplace = web3.eth.Contract(GoldMarketplace.abi, networkData.address)
      this.setState({ marketplace })
      const GoldCount = await marketplace.methods.GoldCount().call()
      this.setState({ GoldCount })
      // Load products
      for (var i = 1; i <= GoldCount; i++) {
        const gold = await marketplace.methods.Golds(i).call()
        this.setState({
          Golds: [...this.state.Golds, gold]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      GoldCount: 0,
      Golds: [],
      loading: true
    }

    this.createGold = this.createGold.bind(this)
    this.purchaseGold = this.purchaseGold.bind(this)
  }

  createGold(name, price, color, karat, purity,tola) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createGold(name, price,color, karat, purity,tola).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseGold(id, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseGold(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  Golds={this.state.Golds}
                  createGold={this.createGold}
                  purchaseGold={this.purchaseGold} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
