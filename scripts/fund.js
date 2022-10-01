const { getNamedAccounts, ethers } = require("hardhat")

const fundme = async({fundingAmount}) =>{
    console.log("Contract is being funded !!!")
    const {deployer} = await getNamedAccounts()
    const fundme = await ethers.getContract("FundMe", deployer)
    const trx_response = await fundme.fund_deposit({value: ethers.utils.parseEther(fundingAmount)})
    await trx_response.wait(1)
    const balance = (await ethers.provider.getBalance(fundme.address)).toString()
    console.log(`Contract Funded with balance : ${balance}`)
}


fundme({fundingAmount:"1"})