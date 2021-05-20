// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin//contracts/access/Ownable.sol";

contract Wallet is Ownable {

    //we need a token struct to keep track of common token attrivutes such as
    //the token address and its ticker or shorthand identifier
    struct Token {
        string ticker;
        address tokenAddress;
    }
    
    
    
    
    event deposited(address depositedFrom, address depositedTo, uint256 amount, string ticker);
    //we can now create a Token log array to keep track of all our token instaces
    mapping(string => Token) public tokenMapping;
    string[] public tokenList;
    
    //we will begin with a double mapping that maps an address token ticker or symbol
    // which maps to the balance of that token. We can have balances of many types of
    //tokens /eth so we need a mapping to keep track of this
    mapping(address => mapping(string => uint256)) public balances;

    //now we will create the functions we need 
    //function to add tokens
    function getOwner() public view virtual returns(address) {
        return msg.sender;
    }
    function addToken(string memory ticker, address tokenAddress) external onlyOwner {

        //create new token
        tokenMapping[ticker] = Token(ticker, tokenAddress);
        //add the new token to the token list
        tokenList.push(ticker);
    }

    //deposit function
    function deposit(uint amount, string memory ticker) external returns(bool _success) {
        require(tokenMapping[ticker].tokenAddress != address(0));
        IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
        balances[msg.sender][ticker] += amount;  
        _success = true;
        //emit deposited(msg.sender, address(this), amount, ticker);

        return _success;
    }

    //withdrawal function
    function withdraw(uint amount, string memory ticker) external {
        require(tokenMapping[ticker].tokenAddress != address(0));
        require(balances[msg.sender][ticker] >= amount);
        balances[msg.sender][ticker] += amount;
        IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);


    }

    function getBalance(address tokenHolder, string memory ticker) public view returns (uint) {
        return balances[tokenHolder][ticker];
    }
}
