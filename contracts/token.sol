// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    //automatically mint eth on contratc creation
    constructor () ERC20("ChainLink", "LINK") {

        _mint(msg.sender, 100000000);
    }

}

contract Eth is ERC20 {

    constructor () ERC20("Ether", "ETH") {

        _mint(msg.sender, 1000000000000);
    }

}

contract VeChain is ERC20 {

    constructor () ERC20("VeChain", "Vet") {

        _mint(msg.sender, 1000000000000);
    }

}

