const { run } = require("hardhat")
const verifyContract = async(contractAddress,constructorArguments) => {
    try{
        await run('verify:verify',{
            address: contractAddress,
            constructorArguments: constructorArguments
        })
    }
    catch(error){
        console.log(error)
    }
}
module.exports={
    verifyContract
}