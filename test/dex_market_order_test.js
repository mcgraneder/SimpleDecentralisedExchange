//next we need to create maekwt order function.
//when creating a sell market order the user should have enought tokens
//when creating a buy order the user should have enough eth
//market orders can be submitted even when the order book is empty
//market orders should be filled until the orderbook is empty or the order is 100% filled
//the eth balance of the buyer should increase with filled orders
//the token balance of the sellers should decrease as orders are filled
//filled limit orders should be removed from the orderbook
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

    it("When creating a sell market order the user should have enough tokens", async () => {

        dex = await Dex.deployed()
        eth = await Eth.deployed()
        link = await Token.deployed()

        await dex.addToken("ETH", eth.address)
        await dex.addToken("LINK", link.address)
        await eth.approve(dex.address, 1000)
        await link.approve(dex.address, 1000)

        await dex.deposit(1000, "LINK")
        //await dex.deposit(1000, "LINK")
       
        //test that user has enough eth to settle sell market order
        //cant sell more tokens that you own
        await truffleAssert.passes(await dex.createMarketOrder(0, "LINK", 50 , 2)) 
        await truffleAssert.reverts(dex.createMarketOrder(0, "LINK", 2001 , 1)) 

       
    })

    it("When creating a buy market order the user should have enough eth", async () => {

        dex = await Dex.deployed()
        eth = await Eth.deployed()
        link = await Token.deployed()

        await dex.addToken("ETH", eth.address)
        await dex.addToken("LINK", link.address)
        await eth.approve(dex.address, 1000)
        await link.approve(dex.address, 1000)

        await dex.deposit(1000, "ETH")
        //await dex.deposit(1000, "LINK")
        
        //test that user has enough eth to settle sell market order
        await truffleAssert.passes(await dex.createMarketOrder(1, "LINK", 50 , 2)) 
        await truffleAssert.reverts(dex.createMarketOrder(1, "LINK", 2001 , 1)) 

    })

    it("Market orders can be submitted even if the orderbook is empty", async () => {

        let dex = await Dex.deployed()
        let eth = await Eth.deployed()
        let link = await Token.deployed()

        await dex.addToken("ETH", eth.address)
        await dex.addToken("LINK", link.address)
        await eth.approve(dex.address, 1000)
        await link.approve(dex.address, 1000)

        await dex.deposit(1000, "ETH")
        //await dex.deposit(1000, "LINK")
        
        //test that user has enough eth to settle sell market order
        orderBookBuy = await dex.getOrders(0, "ETH")
        await assert(orderBookBuy.length == 0)
        await truffleAssert.passes(await dex.createMarketOrder(0, "ETH", 50 , 2)) 
        
        orderBookSell = await dex.getOrders(1, "ETH")
        await assert(orderBookSell.length == 1)
        // // await dex.createMarketOrder(0, "LINK", 50 , 2)
        // // await dex.createMarketOrder(0, "LINK", 50 , 2)
        // //dex.createMarketOrder(1, "LINK", 1000001 , 1)) 

        // console.log(orderBookBuy)
        // console.log(orderBookSell)
    

       
    })

    it("Market orders should be filled until 100% filled or else the order book is empty", async () => {

        let dex = await Dex.deployed()
        let eth = await Eth.deployed()
        let link = await Token.deployed()

        await dex.addToken("ETH", eth.address)
        await dex.addToken("LINK", link.address)
        await eth.approve(dex.address, 1000)
        await link.approve(dex.address, 1000)

        await dex.deposit(1000, "ETH")
        await dex.deposit(1000, "LINK")
        
        
        await dex.createMarketOrder(0, "LINK", 50 , 2)
        await dex.createMarketOrder(0, "LINK", 20 , 2)
        await dex.createMarketOrder(0, "LINK", 30 , 2)

        orderBookSell = await dex.getOrders(1, "LINK")

        for (let i = 0; i < orderBookSell.length; i++ ) {

            await assert(orderBookSell[i].filled == false)
        }
        
        orderBookBuy = await dex.getOrders(0, "LINK")
        await assert(orderBookBuy.length == 0)

        await dex.createLimitOrder(0, "LINK", 100 , 2)
        
        orderBookSell = await dex.getOrders(1, "LINK")
        orderBookBuy = await dex.getOrders(0, "LINK")

        await assert(orderBookSell.length == 0)
        await assert(orderBookBuy.length == 0)

        // // await dex.createMarketOrder(0, "LINK", 50 , 2)
        // //dex.createMarketOrder(1, "LINK", 1000001 , 1)) 

        // console.log(orderBookBuy)
        // console.log(orderBookSell)
    
    })

    it("The eth balance of the buyer should decrease with filled orders and likewise the token balance of the seller should decrease", async () => {

        let dex1 = await Dex.deployed()
        let eth1 = await Eth.deployed()
        let link1 = await Token.deployed()

        await dex1.addToken("ETH", eth.address)
        await dex1.addToken("LINK", link.address)

        await link1.transfer(accounts[1], 1000)
        await eth1.transfer(accounts[1], 1000)

        await eth1.approve(dex.address, 1000, {from: accounts[0]})
        await eth1.approve(dex.address, 1000, {from: accounts[1]})
        await link1.approve(dex.address, 1000, {from: accounts[0]})
        await link1.approve(dex.address, 1000, {from: accounts[1]})

        await dex1.deposit(1000, "ETH", {from: accounts[0]})
        await dex1.deposit(1000, "LINK", {from: accounts[0]})
        await dex1.deposit(1000, "ETH", {from: accounts[1]})
        await dex1.deposit(1000, "LINK", {from: accounts[1]})
        //await dex.deposit(1000, "LINK")

        account0EthBalance = await dex1.getBalance(accounts[0], "ETH")
        account0LinkBalance = await dex1.getBalance(accounts[0], "LINK")
        account1EthBalance = await dex1.getBalance(accounts[1], "ETH")
        account1LinkBalance= await dex1.getBalance(accounts[1], "LINK")

        // console.log(account0EthBalance)
        // console.log(account1EthBalance)
        // console.log(account0LinkBalance)
        // console.log(account1LinkBalance)

        assert(account0EthBalance == 4000)
        assert(account0LinkBalance == 3000)
        assert(account1EthBalance == 1000)
        assert(account1LinkBalance == 1000)

        await dex1.createLimitOrder(0, "LINK", 50 , 10, {from: accounts[0]})
        await dex1.createMarketOrder(0, "LINK", 50 , 10, {from: accounts[1]})

        account0EthBalance = await dex1.getBalance(accounts[0], "ETH")
        account0LinkBalance = await dex1.getBalance(accounts[0], "LINK")
        account1EthBalance = await dex1.getBalance(accounts[1], "ETH")
        account1LinkBalance= await dex1.getBalance(accounts[1], "LINK")

        //the eth balance of accounts 0 should reduce
        //the token balance of accounts[1] should increase
        await assert(account0EthBalance == 3500)
        await assert(account0LinkBalance == 3050)
        await assert(account1EthBalance == 1500)
        await assert(account1LinkBalance == 950)
        
       
    })


    
})