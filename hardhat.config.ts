import { task } from "hardhat/config";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

import { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";

const chainIds = {
  mainnet: 1,
  rinkeby: 4,
  kovan: 42,
  hardhat: 31337,
};


const MNEMONIC = process.env.MNEMONIC || "";
const MORALIS_API_KEY = process.env.MORALIS_API_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


function createNetworkConfig(network: keyof typeof chainIds): NetworkUserConfig {
  let url: string;
  let _mnemonic = MNEMONIC;

  url = "https://" + "speedy-nodes-nyc.moralis.io/" + MORALIS_API_KEY + "/eth/" + network;

  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic: _mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: chainIds.hardhat,
      forking: {
        url: "https://" + "speedy-nodes-nyc.moralis.io/" + MORALIS_API_KEY + "/eth/kovan"
      },
    },
    mainnet: createNetworkConfig("mainnet"),
    kovan: createNetworkConfig("kovan"),
    rinkeby: createNetworkConfig("rinkeby"),
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    enabled: false,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 20000000
  }
};

export default config;
