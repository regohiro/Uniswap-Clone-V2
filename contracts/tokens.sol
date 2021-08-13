// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dai is ERC20{
  constructor(uint256 _amount) ERC20("Dai", "DAI"){
    _mint(msg.sender, _amount);
  }
}

contract Link is ERC20{
  constructor(uint256 _amount) ERC20("Chainlink", "LINK"){
    _mint(msg.sender, _amount);
  }
}

contract Uni is ERC20{
  constructor(uint256 _amount) ERC20("Uniswap", "UNI"){
    _mint(msg.sender, _amount);
  }
}