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

  // getAllowance method can be used to get the approved amount for the user.
  const erc20Token1 = posClient.erc20(process.env.ROOT_TOKEN,
    true
  );
  const balance1 = await erc20Token1.getAllowance(process.env.WALLETADDRESS);
  console.log("allowance", balance1);
}

console.log(test());