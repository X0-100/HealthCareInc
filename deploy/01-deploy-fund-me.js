/*
DESTRUCTURING 
            getNamedAccounts
            deployments
from hre and pass onto the async function
*/

const { network } = require("hardhat")
const { verify } = require("../hardhat.config")
const { pricefeedAddress, development_chain } = require("../helper-hardhat-config")
const { verifyContract  } = require("../utilitie/verify")

module.exports = async ({getNamedAccounts, deployments}) => {
    const{ deployer } = await getNamedAccounts()
    const{ deploy, log, get} = deployments
    const chainId = network.config.chainId
    
    let pricefeed
    if(development_chain.includes(network.name)){
        const deployedContract = await get("MockV3Aggregator")
        pricefeed = deployedContract.address
    }
    else{
        pricefeed = pricefeedAddress[chainId]["ethUsdPriceFeed"]
        log(`FundMe Contract Is getting deloyed...`)
        log(`Deployer Info --  ${deployer}`)
    }

    const fundMe = await deploy("FundMe",{
        from:   deployer,
        args:   [pricefeed],
        log:    true,
        blockConfirmations: network.config.waitConfirmations
    })

    const block_address = fundMe.address
    if(!development_chain.includes(network.name)){
        //VERIFY CONTRACT
        await verifyContract(block_address,[pricefeed])
    }
    
}

module.exports.tags = ["all"]