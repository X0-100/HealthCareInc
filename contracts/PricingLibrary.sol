// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0      ;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol" ;
import "hardhat/console.sol";

library PriceFeed {

     function priceUSD (AggregatorV3Interface chainlink_datafeed) view internal returns(uint256){ 
        (,int256 answer,,,) = chainlink_datafeed.latestRoundData()  ;
        return(uint256(answer * 10000000000)) ;
    }


    function conversion(uint256 ethAmount, AggregatorV3Interface chainlink_datafeed) view internal returns(uint256){
        return (priceUSD(chainlink_datafeed) * ethAmount) / 1000000000000000000 ;
    }
}