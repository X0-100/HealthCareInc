
const { network } = require("hardhat")
const {development_chain} = require("../helper-hardhat-config")
const {DECIMAL} = require("../helper-hardhat-config")
const {INITIAL_ANSWER} = require("../helper-hardhat-config")

module.exports  = async({getNamedAccounts, deployments}) => {
    const {deploy,log} = deployments
    const {deployer} = await getNamedAccounts()
    log(`Mock is getting deployed by deployer  ${deployer}`)
    if(development_chain.includes(network.name)){

        await deploy("MockV3Aggregator",{
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMAL,INITIAL_ANSWER],
            log: true
        })

    }
}
module.exports.tags = ["mock","all"]