const { assert, expect } = require("chai")
const { ethers, deployments, getNamedAccounts} = require("hardhat")
const { development_chain } = require("../../helper-hardhat-config")


const fundingAmount = ethers.utils.parseEther("1") // 1,000,000,000,000,000,000 WEI CURRENCY

!development_chain.includes(network.name) ? describe.skip
:describe("Fund Me Receive Fund And Withdrawal Operations In TestNet", async()=>{
    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach("FundMe Contract Deployed",async()=>{
        await deployments.fixture(["all"])
        /*
        const deployer = await getNamedAccounts()
        */
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe",deployer) 
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer)
    })
    describe("Constructor", async() => {
        it("Sets the aggregator address correctly", async()=>{
            let actual_Value_pricefeedAddress = mockV3Aggregator.address
            let expected_value_pricefeedAddress = await fundMe.get_PriceFeed()
            assert.equal(expected_value_pricefeedAddress,actual_Value_pricefeedAddress,"Price Feed Address in COntract Is Different from Price Feed Chain Link Address")
        })
    })
    describe("FundMe Minimum USD Required", async()=>{
        it("Requires Sufficient Fund", async()=>{
            await expect(fundMe.fund_deposit()).to.be.reverted
        })
        it("Updates funding with sufficient amount", async()=>{
            await fundMe.fund_deposit({value: fundingAmount})    
            const amountFunded = (await fundMe.get_AmountFunded(deployer)).toString()
            assert.equal(amountFunded, fundingAmount, "Funding amount is not the same as the amount funded by deployer!! ")
        })
        it("Updates the funder array with recent funder address", async()=> {
            await fundMe.fund_deposit({value: fundingAmount}) 
            let funder_address = await fundMe.get_Funder(0)
            assert.equal( funder_address, deployer, "Failed, different address getting added to contract")
        })
    })
    describe("Withdraw Function", async()=> {
        let contract_funding_balance_INITIAL
        let deployer_funding_balance_INITIAL
        beforeEach("Make Sure deployer has funded 1 ETH to Contract", async()=>{
            await fundMe.fund_deposit({value: fundingAmount})
            contract_funding_balance_INITIAL = await ethers.provider.getBalance(fundMe.address)
            deployer_funding_balance_INITIAL = await ethers.provider.getBalance(deployer)
        })
        it("Withdraw ETH by a single funder", async()=>{
            /* Arrange */
            let deployerEndingBalance
            let contractEndingBalance

            /* Act */
            let transaction_response = await fundMe.fund_withdraw()
            let transaction_receipt = await transaction_response.wait(1)
            let{ gasUsed, effectiveGasPrice} = transaction_receipt
            let gasCost = gasUsed.mul(effectiveGasPrice)

            deployerEndingBalance    = await ethers.provider.getBalance(deployer)
            contractEndingBalance    = await ethers.provider.getBalance(fundMe.address)

            let expected_DEPLOYER_END_BALANCE =  (contract_funding_balance_INITIAL.add(deployer_funding_balance_INITIAL)).toString()
            let actual_DEPLOYER_END_BALANCE = (deployerEndingBalance.add(gasCost)).toString()

            /* Assert */
            assert.equal(contractEndingBalance.toNumber(),0,"Contract Fund Withdraw went wrong")     
            assert.equal(actual_DEPLOYER_END_BALANCE,expected_DEPLOYER_END_BALANCE,"Test Failed as deployer NET BALANCE IN ACTUAL is different from what NET BALANCE EXPECTED")
        })

        it("Withdraw ETH by multiple funders", async()=>{
            const accounts =  await ethers.getSigners() 
            let funding_net_balance
            let NETcontract_funding_BALANCE
            /*  ARRANGE                         */
            /*  Submit Eth by multiple funders  */
            for(let account=1; account<accounts.length; account++){
                const fundMe_PROXY_ACC = await fundMe.connect(accounts[account])
                await fundMe_PROXY_ACC.fund_deposit({value:fundingAmount})
                funding_net_balance = await (ethers.provider.getBalance(fundMe.address))
            }
            /* ACT */
            NETcontract_funding_BALANCE = await (ethers.provider.getBalance(fundMe.address))
            /* ASSERT */
            assert.equal(NETcontract_funding_BALANCE.toString(),
            funding_net_balance.toString(),"Net Funding Balance is total funded by different accounts")

            let deployer_After_funding_BALANCE = await (ethers.provider.getBalance(deployer))
            assert.equal(deployer_After_funding_BALANCE.toString(),deployer_funding_balance_INITIAL.toString(),"Deployer Balance Initial \
            is not same as multiple account funding")

            const transaction_response = await fundMe.fund_withdraw()
            const trx_receipt = await transaction_response.wait(1)
            const {gasUsed, effectiveGasPrice} = trx_receipt

            const contract_end_balance = await ethers.provider.getBalance(fundMe.address)
            assert.equal(contract_end_balance,0,"Contract funding balance after withdrawal should be zero")

            const gasConsumption = gasUsed.mul(effectiveGasPrice)
            const deployerEndingBalance = await ethers.provider.getBalance(deployer)

            let actual_DEPLOYER_END_BALANCE =  ((NETcontract_funding_BALANCE.add(deployer_funding_balance_INITIAL))).toString()
            let expected_DEPLOYER_END_BALANCE = (deployerEndingBalance.add(gasConsumption)).toString()

            assert.equal(actual_DEPLOYER_END_BALANCE,expected_DEPLOYER_END_BALANCE,"Actual Deployer Balance \
            is not the same as EXpected Deployer Balance!!")

            /*
            Make sure the funders are reset properly
            */

            await expect(fundMe.get_Funder(0)).to.be.reverted

            for(let funder_loop = 1; funder_loop<accounts.length; funder_loop++){
                assert.equal(await fundMe.get_AmountFunded(accounts[funder_loop].address),0,"Funded amount should be zero failed")
            }
        })
        it("Only the owner of the contract can withdraw funds from contract", async()=>{
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker) 
            await expect(attackerConnectedContract.fund_withdraw()).to.be.reverted
        })
    })
})