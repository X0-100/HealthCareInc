//SPDX-License-Identifier: MIT
/*
pragma
*/
pragma solidity ^0.8.0  ;
/*
Imports: Libraries-Contracts
*/
import "./PricingLibrary.sol"  ;
import "hardhat/console.sol";
/*  
ErrorCodes                    
*/
error FundMe__NotOwner()   ;
error FundMe__InsufficientFund() ;


/**@title Medical Ememrgency Funding Contract
 * @author HealthCare Inc
 * @notice Solidity Main Contract Transaction Getway
 * @dev This implements PriceFeed Library
 */                                        
contract FundMe {
    /*
    TypeDeclarations
    */
    using PriceFeed for uint256   ;
    /*
    |StateVariables|
    */
    address private immutable I_owner_of_this_contract  ;
    uint256 public constant  MIN_USD = 50 * 1000000000000000000  ;
    address  [] private  S_funders   ;
    mapping(address => uint256) private  S_addressToAmountFunded   ;
    AggregatorV3Interface private S_pricefeed  ;
    /*
    |Modifiers|
    */
    modifier onlyOwner {
    if(msg.sender != I_owner_of_this_contract) revert FundMe__NotOwner();
    _ ;
    }  
    //  Functions Order:
    /// constructor
    /// receive
    /// fallback
    /// external
    /// public
    /// internal
    /// private
    /// view /pure
    constructor(address pricefeed_address){
        I_owner_of_this_contract = msg.sender                                                                 ;
        S_pricefeed = AggregatorV3Interface(pricefeed_address);
    }

    /**
     * @notice This is the main funding point
     * @dev This implements price feed
    */
    function fund_deposit () public payable {
        //require(msg.value.conversion(S_pricefeed) >= MIN_USD, "Minimum USD is 50 $");
        if(msg.value.conversion(S_pricefeed) < MIN_USD) revert FundMe__InsufficientFund();
        S_addressToAmountFunded[msg.sender] += msg.value      ;
        S_funders.push(msg.sender)      ;
    }

    /**
     * @notice this contract is for withdrawing assets from the upholded contract 
     * @dev will check on it further
    */
    function fund_withdraw () public onlyOwner {
        uint256 funders_length = S_funders.length;
        address [] memory fundersResidence = S_funders;
        for(uint256 funder_RADAR = 0; funder_RADAR < funders_length; funder_RADAR++){
            address funder_address = fundersResidence[funder_RADAR] ;
            S_addressToAmountFunded[funder_address] = 0 ;
        } 
        S_funders = new address[](0);
        (bool transfer_state,) = payable(msg.sender).call{value: address(this).balance}("");
        require(transfer_state);
    }
    /**
     * @notice function for accesing private state variables
     */
    function get_Owner() external view returns(address){
        return I_owner_of_this_contract;
    }
    function get_Funder(uint256 index) external view returns(address){
        return S_funders[index];
    }
    function get_AmountFunded(address funder) external view returns(uint256) {
        return S_addressToAmountFunded[funder];
    }
    function get_PriceFeed() external view returns(AggregatorV3Interface){
        return S_pricefeed;
    }
    // /**
    //  * @notice this is the standard solidity receive legacy function
    //  * @dev this function will get called when funder funds contract but without passing any existing contract calldata 
    //  */   
    // receive() external payable{
    //     fund_deposit();       
    // }
    // /**
    //  * @notice this is the standard solidity fallback legacy function
    //  * @dev this function will get called when funder funds contract but providing with different calldata that doesnt exist in contract
    //  */  
    // fallback() external payable{
    //     fund_deposit();
    // }
}