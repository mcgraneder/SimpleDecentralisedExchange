# SimpleDecentralisedExchange
This is my first solidity project and i have created a simple decentralised exchange that allows users to buy/sell ERC20 tokens in exchange for eth

# Step 1
to use this repository for yourself there are a few steps you need to follow. Firstly create a new directory somewhere in your computer. Open your cmd or terminal in that directory. Once you do so come back to ths repository and copy the repository link. You can get it by clicking the "green" code bytton on the main branch page of this repo. Onc done type ``git clone`` into your terminal a space and then paste the repo link.

# step 2
Once cloned successsfully, while remaining in your terminal type ``cd SimpleDecentralisedExchange/`` to change intot the directory with the code. The node and truffle dependancyies will already come preinstalled so there is no need to to type ``npm  init`` or ``truffle init``. To compile the code go back to your console which is in the project directory and type ``truffle develop``. Once it loads simply type ``truffle migrate`` to compile. Note if you have compiled once brefore and then made changes to the code you need to type ``truffle migrate --reset`` to compile correctly. With that the code should compile and be able to be tested

# Step 3
Have a look through the code and see what functions there are. To use this code in truffle develope initialise the dex, eth and link tokens by typing ``let dex = await Dex.deployed``. ``let eth = await Eth.deployed`` etc... When initialised simply type ``dex``, or ``eth`` to get a list of all of the functions that you can use with the instance. To know what arguments they take simply refer to the code. The way we set up the dex can be seen with the tests written in the test folder

#step 4
One final thing that may not be installed im not sure is the truffle assertions. We need these to run the ``truffle test`` command which will run all of the 15 tests i have written. If you type "truffle test" into the console and nothing happens or you dont get 15 passes then maybe try installing truffle assertions with ``npm install truffle-assertions``. This is not the most important as i have already tested the code briefly. But if you want to change and modify for yourself its a god ideaa to get the premade tests working with truffle assertions.

# Enjoy
