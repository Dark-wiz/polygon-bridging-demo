const { POSClient, use } = require("@maticnetwork/maticjs");
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

  // approve method can be used to approve required amount on the root token.
  // approve is required in order to deposit amount on polygon chain.
  const erc20RootToken = posClient.erc20(
    process.env.ROOT_TOKEN,
    true
  );
  //approve 100 amount
  const approveResult = await erc20RootToken.approve(
    JSON.stringify(1 * 1e18)
  );
  const txHash = await approveResult.getTransactionHash();
  const txReceipt = await approveResult.getReceipt();
  console.log("approval hash", txHash);
}

console.log(test());