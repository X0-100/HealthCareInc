const { ethers, getNamedAccounts } = require("hardhat")

const withdraw = async() => {
    const {deployer} = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    const trx_response = await fundMe.fund_withdraw()
    const trx_receipt = await trx_response.wait(1)
    console.log("Fund Withdrawn Success, details as mentioned below : ")
    const {gasUsed, effectiveGasPrice } = trx_receipt
    const gasCost = gasUsed.mul(effectiveGasPrice)
    const fundMe_balance = await ethers.provider.getBalance(fundMe.address)
    const deployer_balance = await ethers.provider.getBalance(deployer)
    console.log("******************************************")
    console.log(`Contract FundMe Balance : ${fundMe_balance}`)
    console.log(`Deployer Address : ${deployer}`)
    console.log(`Deployer Balance  : ${deployer_balance}`)
    console.log(`Gas Cost : ${gasCost}`)
    console.log("*******************************************")
}

withdraw()