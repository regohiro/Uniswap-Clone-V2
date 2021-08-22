import { deployer } from "./../utils/deploy";
import { Uni } from "./../typechain/Uni.d";
import { Link } from "./../typechain/Link.d";
import { Dai } from "./../typechain/Dai.d";
import { Dex } from "./../typechain/Dex.d";

import { ethers, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";
import chai from "chai";
import { SignerWithAddress } from "hardhat-deploy-ethers/dist/src/signers";
import { toWei, setDefaultSigner, toBN } from "../utils";

chai.use(solidity);
const { expect } = chai;

/*
 * user[0]: Deployer / Owner of all contracts.
 * user[1]: Normal user: Alice
 * user[2]: Normal user: Bob
 * user[3]: Normal user: Charile
 */

describe("Dex test", () => {
  let users: SignerWithAddress[];
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let charlie: SignerWithAddress;

  let dai: Dai;
  let link: Link;
  let uni: Uni;
  let dex: Dex;

  const totalSupply = toWei(10 ** 10);

  before(async () => {
    //Set accounts
    users = await ethers.getSigners();
    owner = users[0];
    alice = users[1];
    bob = users[2];
    charlie = users[3];

    //Set default signer 
    setDefaultSigner(owner);

    //Deploy token contracts
    dai = (await deployer("Dai")) as Dai;
    link = (await deployer("Link")) as Link;
    uni = (await deployer("Uni")) as Uni;

    //Deploy dex contract
    const tokenAddr = [dai.address, link.address, uni.address];
    const tokenPriceAddr = [
      "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541",
      "0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38",
      "0x17756515f112429471F86f98D5052aCB6C47f6ee",
    ];
    dex = (await deployer("Dex", tokenAddr, tokenPriceAddr)) as Dex;

    //Transfer token to dex
    await dai.transfer(dex.address, totalSupply);
    await link.transfer(dex.address, totalSupply);
    await uni.transfer(dex.address, totalSupply);
  });

  describe("Basic token test", () => {
    it("Should return the correct metadata", async () => {
      expect(await dai.name()).to.equal("Dai");
      expect(await uni.symbol()).to.equal("UNI");
    });
  });

  describe("Token price test", () => {
    it("Should return token price", async () => {
      const daiPrice = await dex.getPrice(dai.address);
      const linkPrice = await dex.getPrice(link.address);
      const uniPrice = await dex.getPrice(uni.address);
      console.log(`Dai price: ${daiPrice}`);
      console.log(`Link price: ${linkPrice}`);
      console.log(`Uni price: ${uniPrice}`);
    });

    it("Should return correct amount", async () => {
      const linkPrice = await dex.getPrice(link.address);
      const toPay = toWei(10);
      await dex.connect(owner).buyToken(link.address, {value: toPay});
      const amount = await link.balanceOf(owner.address);
      expect(amount).to.equal(toPay.mul(toBN(10).pow(18)).div(linkPrice));
    });
  });
});