// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dai is ERC20{
  constructor() ERC20("Dai", "DAI"){
    _mint(msg.sender, 10**10 * 10**18);
  }
}

contract Link is ERC20{
  constructor() ERC20("Chainlink", "LINK"){
    _mint(msg.sender, 10**8 * 10**18);
  }
}

contract Uni is ERC20{
  constructor() ERC20("Uniswap", "UNI"){
    _mint(msg.sender, 10**8 * 10**18);
  }
}