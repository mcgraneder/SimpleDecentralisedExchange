//we want to bring in our dex file which also
//contains the dex.Since dex inherits dex
//we do not need to require dex here
const Dex = artifacts.require("Dex");
const Token = artifacts.require("Token");
const Eth = artifacts.require("Eth");
const VeChain= artifacts.require("VeChain");


//we need to import mocha to run tests
var truffleAssert = require("truffle-assertions");

//truffle uses mocha to run tests. Each time we define a contract
//statment like below an instance of our deployment is made andinside
//che contratc function we write our tests
contract('Dex', accounts => {
    //initialise test with 'it'
    it("it should only be possible for owner to add tokens", async () => {

        let dex = await Dex.deployed()
        
        let token = await Token.deployed()
        let eth = await Eth.deployed()
        let vet = await VeChain.deployed()
        await truffleAssert.passes(
            dex.addToken("LINK", token.address, {from: accounts[0]}), 
        )

        await truffleAssert.passes(
            dex.addToken("ETH", eth.address, {from: accounts[0]})
        )

        await truffleAssert.passes(
            dex.addToken("VeChain", vet.address, {from: accounts[0]})
        )
    })

    //it should not be possible for other accounts to add tokens
    it("it should only be possible for owner to add tokens", async () => {

        let dex = await Dex.deployed()
        let token = await Token.deployed()
        let eth = await Eth.deployed()
        let vet = await VeChain.deployed()
        await truffleAssert.reverts(
            dex.addToken("LINK", token.address, {from: accounts[1]})
        )

        await truffleAssert.reverts(
            dex.addToken("ETH", eth.address, {from: accounts[1]})
        )

        await truffleAssert.reverts(
            dex.addToken("VeChain", vet.address, {from: accounts[1]})
        )
    })

    //test to handle correct deposit functionality
    it("it should handle deposits correctly", async () => {

        let dex = await Dex.deployed()
        let token = await Token.deployed()
        await token.approve(dex.address, 10000)
        await truffleAssert.passes(
            dex.deposit(200, "LINK")
        );
        //to test we must assert that the balance is actually 200
        assert.equal(await dex.balances(accounts[0], "LINK"), 200);

        // //we can try another test
        // await truffleAssert.passes(
        //     dex.addToken("LINK", token.address, {from: accounts[1]})
        // )
    })

    //test to handle correct withdrawal functionality
    it("it should faulty withdrawals withdrawals correctly", async () => {

        let dex = await Dex.deployed()
        let token = await Token.deployed()
        //await token.approve(dex.address, 10000)
        
        //test passes of this statment reverst (not allowed to withdraw more
        //than our account balance)
        await truffleAssert.reverts(dex.withdraw(300, "LINK"));
    })

    //test to handle correct withdrawal functionality
    it("it should faulty sound withdrawals correctly", async () => {

        let dex = await Dex.deployed()
        let token = await Token.deployed()
        //await token.approve(dex.address, 10000)
        
        //test passes of this statment reverst (not allowed to withdraw more
        //than our account balance)
        await truffleAssert.passes(dex.withdraw(100, "LINK"));
    })

})

 