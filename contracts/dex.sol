// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Dex is Ownable{
  event BuyToken(address tokenAddr, address account, uint256 amount, uint256 cost);
  event SellToken(address tokenAddr, address account, uint256 amount, uint256 cost);
  event Deposit(address depositer, uint256 amount);
  event Withdraw(address _tokenAddr, uint256 amount);
  event AddNewToken(address _tokenAddr);
  event RemoveToken(address _tokenAddr);

  mapping(address => bool) public supportedTokenAddr;
  mapping(address => address) public tokenToPriceAddr;

  modifier supportsToken(address _tokenAddr) {
    require(supportedTokenAddr[_tokenAddr] == true, "Dex: This token is not supported");
    _;
  }

  receive() external payable {
    emit Deposit(msg.sender, msg.value);
  }

  constructor(address[] memory _tokenAddr, address[] memory _tokenPriceAddr){
    for(uint i = 0; i < _tokenAddr.length; i++){
      supportedTokenAddr[_tokenAddr[i]] = true;
      tokenToPriceAddr[_tokenAddr[i]] = _tokenPriceAddr[i];
      emit AddNewToken(_tokenAddr[i]);
    }
  }

  function getPrice(address _tokenAddr) public view supportsToken(_tokenAddr) returns(uint256){
    AggregatorV3Interface priceFeed = AggregatorV3Interface(tokenToPriceAddr[_tokenAddr]);
    (,int price,,,) = priceFeed.latestRoundData();
    return uint256(price);
  }

  function buyToken(address _tokenAddr) external payable supportsToken(_tokenAddr) returns(uint256 amount){
    IERC20 token = IERC20(_tokenAddr);
    amount = msg.value * getPrice(_tokenAddr);
    require(token.balanceOf(address(this)) >= amount, "Dex: Token sold out");
    token.transfer(msg.sender, amount);
    emit BuyToken(_tokenAddr, msg.sender, amount, msg.value);
  }

  function sellToken(address _tokenAddr, uint256 _value) external supportsToken(_tokenAddr) returns(uint256 amount){
    IERC20 token = IERC20(_tokenAddr);
    amount = _value / getPrice(_tokenAddr);
    require(address(this).balance >= amount, "Dex: Cannot afford this token");
    token.transferFrom(msg.sender, address(this), _value);
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Dex: ETH transfer unsuccessful!");
    emit SellToken(_tokenAddr, msg.sender, amount, _value);
  }

  function withdrawToken(address _tokenAddr, uint256 _amount) external onlyOwner supportsToken(_tokenAddr) {
    IERC20 token = IERC20(_tokenAddr);
    token.transfer(msg.sender, _amount);
    emit Withdraw(_tokenAddr, _amount);
  }

  function withdrawEth(uint256 _amount) external onlyOwner {
    require(_amount >= address(this).balance, "Dex: Insufficient Eth balance");
    (bool success, ) = payable(msg.sender).call{value: _amount}("");
    require(success, "Dex: ETH transfer unsuccessful!");
    emit Withdraw(address(0), _amount);
  }

  function addNewToken(address _tokenAddr, address _tokenPriceAddr) external onlyOwner {
    require(supportedTokenAddr[_tokenAddr] == false, "Dex: This token is already supported");
    supportedTokenAddr[_tokenAddr] = true;  
    tokenToPriceAddr[_tokenAddr] = _tokenPriceAddr;
    emit AddNewToken(_tokenAddr);
  }

  function removeToken(address _tokenAddr) external onlyOwner supportsToken(_tokenAddr) {
    delete supportedTokenAddr[_tokenAddr];  
    delete tokenToPriceAddr[_tokenAddr];
    emit RemoveToken(_tokenAddr);
  }
}