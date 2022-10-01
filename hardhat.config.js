require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("mocha")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})


module.exports = {
  //solidity: "0.8.4",
  solidity: {
    compilers: [
      {
        version: "0.6.8"
      },
      {
        version: "0.8.4"
      }
    ]
  },
  defaultNetwork: "hardhat",
  networks: {
    polygon: {
      url:      process.env.POLYGON_RPC_URL || "",
      accounts: process.env.POLYGON_PRIVATE_KEY !== undefined ? [process.env.POLYGON_PRIVATE_KEY] : [],
      chainId:  80001,
      waitConfirmations: 5.0
    },
    goerli: {
      url:        process.env.GOERLI_RPC_URL || "",
      accounts:   process.env.GOERLI_PRIVATE_KEY !== undefined ? [process.env.GOERLI_PRIVATE_KEY] : [],
      chainId:    5,
      waitConfirmations: 6.6
    },
    localhost:{
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "INR",
    coinmarketcap: process.env.COINMARKET_API_KEY,
    token: "MATIC"
  },
  etherscan: {
    apiKey: process.env.GOERLI_ETHERSCAN_API_KEY || process.env.POLYGON_ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default : 0,
      //5 : 0,
      //31337 : 2
    },
    user : {
      defualt : 1
    }
  }
}
