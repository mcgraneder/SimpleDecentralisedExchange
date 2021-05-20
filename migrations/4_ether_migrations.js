const Eth = artifacts.require("Eth");
// const Eth = artifacts.require("Eth");
// const VeChain = artifacts.require("VeChain");
const Dex = artifacts.require("Dex");

//to save us having to write individual commands over and over again
//in the truffle develop console, we can actually save time by prewrritng
//the most importtan commands in our migrations file.
//however we need to make module.exports asynchronous
module.exports = async function (deployer, network, accounts) {
  // //then since its asynce we need to use await keyword here
   await deployer.deploy(Eth);
}