const { assert } = require("chai")
const { parseEther } = require("ethers/lib/utils")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { development_chain } = require("../../helper-hardhat-config")
const fundingAmount = parseEther("1")

development_chain.includes(network.name) ? describe.skip 
:describe("Fund Me Receive Fund And Withdrawal Operations In TestNet", async()=>{
    let fundMe
    let contractFundingBalance
    let contractWithdrawalBalance
    let deployer
    beforeEach("Contract Deployment in Main Net", async () => {
        deployer = (await getNamedAccounts()).deployer
        fundMe   =  await ethers.getContract("FundMe", deployer)
    })
    it("Fund Contractwith valid USD/ETH", async()=>{
        await fundMe.fund_deposit({value: fundingAmount})
        contractFundingBalance = await ethers.provider.getBalance(fundMe)
        assert.equal(fundingAmount,contractFundingBalance,"Amount funded is not the same as Contract Balance")
    })
    it("WIthdraws balance from contract", async()=>{
        await fundMe.fund_withdraw()
        contractWithdrawalBalance = await ethers.provider.getBalance(fundMe)
        assert.equal(contractWithdrawalBalance,0,"Contract Balance after withdrawal should be zero")
    })
})