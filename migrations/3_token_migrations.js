const Token = artifacts.require("Token");
const Eth = artifacts.require("Eth");
const VeChain = artifacts.require("VeChain");
const Dex = artifacts.require("Dex");

//to save us having to write individual commands over and over again
//in the truffle develop console, we can actually save time by prewrritng
//the most importtan commands in our migrations file.
//however we need to make module.exports asynchronous
module.exports = async function (deployer, network, accounts) {
  // //then since its asynce we need to use await keyword here
  await deployer.deploy(Token);
  await deployer.deploy(Eth);
  await deployer.deploy(VeChain);

  // //then we can just begin with the same commands that we write
  // //in the truffle terminal so that we dont have to do the setup
  // //each time
  
  // let dex = await Dex.deployed()
  // let token = await Token.deployed()

  // //then we need to approve the dex owner to spend tokens
  // //await token.approve(dex.address, 1000)
  // //after initialising we need to add token to dex
  // dex.addToken("LINK", token.address)
  // //then we can deposit into the dex
  // //await dex.deposit(50, "LINK")
  // // then we can set a balance variable to quickily get the balance
  // // from the terminal
  //let balanceOfLink = await dex.balances(accounts[0], "LINK");
};
