const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

let MAH_BOI = 'Yo mah boi';

beforeEach(async () => {
  // Get list of accounts
  accounts = await web3.eth.getAccounts();

  // Use one account to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [MAH_BOI]})
    .send({ from: accounts[0], gas: '1000000'});
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, MAH_BOI);
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage('bye')
      .send({ from: accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });
});

// class Car {
//   park() {
//     return 'stopped';
//   }
//
//   drive() {
//     return 'vroom';
//   }
// }
//
// let car;
//
// beforeEach(() => {
//   car = new Car();
// });
//
// describe('Car', () => {
//   it('it can park', () => {
//     assert.equal(car.park(), 'stopped');
//   });
//
//   it('it can drive', () => {
//     assert.equal(car.drive(), 'vroom');
//   });
// })
