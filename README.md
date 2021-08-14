## Usage

### Pre Requisites

Before running any command, make sure to install dependencies:

```
$ yarn 
```

Before deploying to a live network or run test, make sure to fill environment variables: 

```
$ cp .env.example .env
```

### Compile

Compile the smart contracts with Hardhat:

```
$ yarn compile
```

### Deploy contract to a live network + validate to etherscan

Note: requires mnemonic and Moralis API key

```
$ npx hardhat run scripts/token-deploy.ts --network kovan
```

### Test contract locally (Kovan mainnet fork)

Note: requires Moralis API key

```
$ yarn test
```

### Recompile contracts and regenerate types

Note: May need to give permission

```
$ yarn rebuild
```