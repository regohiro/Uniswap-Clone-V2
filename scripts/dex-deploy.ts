import { Uni } from './../typechain/Uni.d';
import { Link } from './../typechain/Link.d';
import { Dai } from './../typechain/Dai.d';

import { ethers } from "hardhat";
import { verify, deployToLiveNetwork, setDefaultSigner, deployer, getContractInstance } from '../utils';
 
async function main() {
  //When called, it will print receipt and verify to Etherscan
  deployToLiveNetwork();

  //Set contract signer (owner)
  const signers = await ethers.getSigners();
  const owner = signers[0];
  setDefaultSigner(owner);

  //Get token contract instance
  const dai = await getContractInstance("Dai") as Dai;
  const link = await getContractInstance("Link") as Link;
  const uni = await getContractInstance("Uni") as Uni;

  //Set dex contract args
  const tokenAddr = [dai.address, link.address, uni.address];
  const tokenPriceAddr = [
    "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541",
    "0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38",
    "0x17756515f112429471F86f98D5052aCB6C47f6ee",
  ];

  //Deploy dex contract
  await deployer("Dex", tokenAddr, tokenPriceAddr);
}

//Excute deploy
main()
  .then(verify)
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });