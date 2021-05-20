//the user must have ETH deposited such that eth >= buy order value
//the user must have enough tokens deposited such that the token balance >= sell order price
//the buy order book should be ordered from highest to lowest starting and index 0

//we want to bring in our dex file which also
//contains the dex.Since dex inherits dex
//we do not need to require dex here
const Dex = artifacts.require("Dex");
const Token = artifacts.require("Token");
const Eth = artifacts.require("Eth");


//we need to import mocha to run tests
var truffleAssert = require("truffle-assertions");

//truffle uses mocha to run tests. Each time we define a contract
//statment like below an instance of our deployment is made andinside
//che contratc function we write our tests
contract('Dex', accounts => {
    //initialise test with 'it'
    it("User must have balance of ETH greater than buy order value", async () => {

        //deploye tokens and eth
        let dex = await Dex.deployed()
        let eth = await Eth.deployed()
        //we need to add eth before doing check
        await dex.addToken("ETH", eth.address, {from: accounts[0]});
        //then we approve and deposit as normal deposit
        await eth.approve(dex.address, 10000)
        await dex.deposit(1000, "ETH")
        
        // now we can do the check to see if we have enough eth for the
        // buy order value
        await truffleAssert.passes(
            await dex.createLimitOrder(0, "ETH", 10, 1)
        )

        //we need to also test if creating a limit order with insufficient balance fails
        await truffleAssert.reverts(
            dex.createLimitOrder(0, "ETH", 10000, 1)
        )
    })

     //the user must have enough tokens deposited such that the token balance >= sell order price
     it("User must have enough tokens deposited greater than sell order value", async () => {

        //deploye tokens and eth
        let dex = await Dex.deployed()
        let token = await Token.deployed()
        //we need to add eth before doing check
        await dex.addToken("LINK", token.address, {from: accounts[0]});
        //then we approve and deposit as normal deposit
        await token.approve(dex.address, 1000000);
        await dex.deposit(2000, "LINK");

        //now we can do the check to see if we have enough eth for the
        //buy order value
        await truffleAssert.passes(
            await dex.createLimitOrder(1, "LINK", 10, 1)
        )

        //we need to also test if creating a limit order with insufficient balance fails
        await truffleAssert.reverts(
            dex.createLimitOrder(1, "LINK", 10000, 1)
        )
    })

    it("The orders in the BuyOrder book must be in accensding order by price", async () => {

        
        //deploye tokens and eth
        let dex = await Dex.deployed()
        let eth = await Eth.deployed()
        //we need to add eth before doing check
        await dex.addToken("LINK", eth.address)
        //then we approve and deposit as normal deposit
        await eth.approve(dex.address, 1000000)
        await dex.deposit(2000, "ETH")
        
        dex.createLimitOrder(0,"ETH", 40, 2)
        dex.createLimitOrder(0, "ETH", 10, 5)
        dex.createLimitOrder(0, "ETH", 35, 3)
        dex.createLimitOrder(0, "ETH", 37, 6)
        dex.createLimitOrder(0, "ETH", 50,  5)
        await dex.sortOrder(0, "ETH", 0, 5)
        let Order = await dex.getOrders(0, "ETH");
        for (let i = 0; i < Order.length - 1; i++) {
            //console.log(Order[i].price)
            await assert(Order[i].price <= Order[i + 1].price)
       }
       //truffleAssert.paases(buyOrder[0] == buyOrder[1])

        // let order = await dex.getOrder1();
        //console.log(order[0]);      
        
    })

    it("The orders in the Sellr book must also be in accensding order by price", async () => {

        
        //deploye tokens and eth
        let dex = await Dex.deployed()
        let link = await Token.deployed()
        //we need to add eth before doing check
        await dex.addToken("LINK", link.address)
        //then we approve and deposit as normal deposit
        await link.approve(dex.address, 1000000)
        await dex.deposit(2000, "LINK")
        
        dex.createLimitOrder(1,"LINK", 40, 2)
        dex.createLimitOrder(1, "LINK", 10, 5)
        dex.createLimitOrder(1, "LINK", 35, 3)
        dex.createLimitOrder(1, "LINK", 37, 6)
        dex.createLimitOrder(1, "LINK", 50,  5)
        await dex.sortOrder(1, "LINK", 0, 5)
        let Order = await dex.getOrders(1, "LINK");
        for (let i = 0; i < Order.length - 1; i++) {
            //console.log(Order[i].price)
            await assert(Order[i].price >= Order[i + 1].price)
       }
       //truffleAssert.paases(buyOrder[0] == buyOrder[1])

        // let order = await dex.getOrder1();
        //console.log(order[0]);   
        //await console.log(Order)   
        
    })

    it("Orders can only be made for supported Tokens", async () => {

        //deploye tokens and eth
        let dex = await Dex.deployed()
        let link = await Token.deployed()
        let eth = await Token.deployed()
        //we need to add eth before doing check
        await dex.addToken("LINK", link.address)
        //then we approve and deposit as normal deposit
        await link.approve(dex.address, 1000000)
        await eth.approve(dex.address, 1000000)
        await dex.deposit(2000, "LINK")
        await dex.deposit(2000, "ETH")
        
        await truffleAssert.passes(await dex.createLimitOrder(1, "ETH", 10, 2))
        await truffleAssert.passes(await dex.createLimitOrder(1, "LINK", 10, 2))
        await truffleAssert.reverts( dex.createLimitOrder(1, "FAKE", 10, 2))
        await truffleAssert.reverts(dex.createLimitOrder(1, "FAKE", 10, 2))

        await truffleAssert.passes(await dex.createLimitOrder(0, "ETH", 10, 2))
        await truffleAssert.passes(await dex.createLimitOrder(0, "LINK", 10, 2))
        await truffleAssert.reverts( dex.createLimitOrder(0, "FAKE", 10, 2))
        await truffleAssert.reverts(dex.createLimitOrder(0, "FAKE", 10, 2))
        
    })

})

 