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

  // POSClient provides erc20 method which helps you to interact with an ERC20 token.
  // The method returns an object which has other various methods.
  // Passing second arguments for isRoot is optional.
  //const erc20token = posClient.erc20("<token address>", "<isRoot>");

  // Token on polygon can be initiated by using this syntax -
  //const childERC20Token = posClient.erc20("<child token address>");

  // Token on ethereum can be initiated by providing the second parameter value as true.
  //const parentERC20Token = posClient.erc20("<parent token address>", true);

  // getBalance method can be used to get the balance of user. It is available on both child and parent token.
  const erc20Token = posClient.erc20(
    "0xdBbB50bea2a012Fe18FAa04F2F575d54f29FDe4F"
  );
  // get balance of user
  const balance2 = await erc20Token.getBalance(process.env.WALLETADDRESS);
  console.log("POLYGONTOKEN", balance2);

  const erc20TokenE = posClient.erc20(
    "0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae",
    true
  );
  // get balance of user
  const balance1E = await erc20TokenE.getBalance(process.env.WALLETADDRESS);
  console.log("ETHTOKEN", balance1E);
}

console.log(test());