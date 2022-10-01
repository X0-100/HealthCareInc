const pricefeedAddress = {

    80001: {
        name: "polygon",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A"
    },

    5:  {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    }


}

const development_chain = ["hardhat","localhost"]

const DECIMAL = 8
const INITIAL_ANSWER = 200000000000



module.exports = {
    pricefeedAddress,
    development_chain,
    DECIMAL,
    INITIAL_ANSWER
}