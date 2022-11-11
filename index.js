const { POSClient, use, estimateGas } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");
const { ethers } = require("ethers");
require("dotenv").config();

// install web3 plugin
use(Web3ClientPlugin);
const posClient = new POSClient();
const parentProvider = ethers.getDefaultProvider("goerli");
const childProvider = ethers.getDefaultProvider(
  "https://rpc-mumbai.matic.today" // for mainnet https://polygon-rpc.com/
);

async function test() {
  await posClient.init({
    log: true,
    network: "testnet", // 'testnet' or 'mainnet'
    version: "mumbai", // 'mumbai' or 'v1'
    parent: {
      provider: new ethers.Wallet(process.env.PRIVATEKEY, parentProvider),
      defaultConfig: {
        from: process.env.WALLETADDRESS,
      },
    },
    child: {
      provider: new ethers.Wallet(process.env.PRIVATEKEY, childProvider),
      defaultConfig: {
        from: process.env.WALLETADDRESS,
      },
    },
  });

  const erc20Token = posClient.erc20(process.env.ROOT_TOKEN,true);

  const result = await erc20Token.deposit(
    JSON.stringify(1 * 1e18),
    process.env.WALLETADDRESS,
    {
      from: process.env.WALLETADDRESS
    }
  );
  const txHash = await result.getTransactionHash();
  console.log("txHash", txHash);
}

console.log(test());