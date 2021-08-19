import { ethers } from "hardhat";
import { verify, deployToLiveNetwork, setDefaultSigner, deployer, toWei } from "../utils";

async function main() {
  //When called, it will print receipt and verify to Etherscan
  deployToLiveNetwork();

  //Set contract signer (owner)
  const signers = await ethers.getSigners();
  const owner = signers[0];
  setDefaultSigner(owner);

  //Deploy token contracts
  await deployer("Dai");
  await deployer("Link");
  await deployer("Uni");
}

//Excute deploy
main()
  .then(verify)
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
