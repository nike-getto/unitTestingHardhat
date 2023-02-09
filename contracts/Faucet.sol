// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Faucet {
    uint256 public number;
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    function withdraw(uint _amount) public payable {
        require(_amount <= 1 gwei);
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function withdrawAll() public onlyOwner {
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function destroyFaucet() public onlyOwner {
        selfdestruct(owner);
    }

    function assignNumber(uint256 _number) public {
        number = _number;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner!");
        _;
    }
}
