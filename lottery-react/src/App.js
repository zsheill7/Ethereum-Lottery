import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    let accounts = await web3.eth.getAccounts();
    const manager = await lottery.methods.manager().call({ from: accounts[0] });
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({
      message: 'Waiting on transaction...'
    });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: '' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked! ' });
  };

  render() {
    web3.eth.getAccounts().then(console.log());
    console.log(web3.version);
    console.log(web3.eth.getAccounts());

    return (
      <div>
        <h2>Lottery</h2>
        <p>
          This contract is managed by {this.state.manager} There are currently{' '}
          {this.state.players.length} entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <p>
          <b>Want to try your luck?</b>
        </p>
        <p>Amount of ether to enter</p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Try ya luck</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
