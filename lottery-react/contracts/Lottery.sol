pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() public {
        manager = msg.sender;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function enter() public payable {
        players.push(msg.sender);
    }

    function pseudorandom() public view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted {

        uint index = pseudorandom() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function returnEntries() {
        require(msg.value > .01 ether);
    }
}
