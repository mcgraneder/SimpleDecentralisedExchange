// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./wallet.sol";
import "../node_modules/@openzeppelin//contracts/access/Ownable.sol";

contract Dex is Wallet {

    uint private id = 0;
    int low = 0;
    int highB;
    int highS;
    
    enum Side {
        BUY,
        SELL
    }

    struct Order {

        address trader;
        string ticker;
        uint256 amount;
        Side side;
        uint id;
        uint price;
        bool filled;
    }

    
    mapping(string => mapping(uint => Order[])) LimitOrderBook;
  
  
    function getOrders(Side side, string memory ticker) public view returns(Order[] memory) {
        //return LimitOrderBook[ticker][uint(side)] book
        return (LimitOrderBook[ticker][uint(side)]);
    }

    //to create a limit LimitOrderBook[ticker][uint(side)] we need to pass in the token ticker, whethere it is a buy or sell LimitOrderBook[ticker][uint(side)]
    //the amount of tokens for the LimitOrderBook[ticker][uint(side)] and at what price we want to buy and sell at
    function createLimitOrder(Side side, string memory ticker, uint amount, uint price) public {
        
        //handle first case for LimitOrderBook[ticker][uint(side)] if it is buy(We must have enough eth to make the LimitOrderBook[ticker][uint(side)])
        //the balances mapping is inherited from our wallet contrac
        if (side == Side.BUY) {

          require(balances[msg.sender]["ETH"] >= amount * price);
          require(balances[msg.sender][ticker] >= amount);
          
          
          Order[] storage newOrder = LimitOrderBook[ticker][uint(side)]; 
          highB = int(newOrder.length);
          newOrder.push(Order(msg.sender, ticker, amount, side, id, price, false));
          sortOrder(side, ticker, low, highB);
          settleOrders(ticker, side);
          id++;
          highB++;

        }else {

          require(balances[msg.sender][ticker] >= amount * price);
          require(balances[msg.sender][ticker] >= amount);
          
          
          Order[] storage newOrder = LimitOrderBook[ticker][uint(side)]; 
          highS = int(newOrder.length);
          newOrder.push(Order(msg.sender, ticker, amount, side, id, price, false));
          sortOrder(side, ticker, low, highS);
          settleOrders(ticker, side);
          id++;
          highS++;


        }

    }

    function createMarketOrder(Side side, string memory ticker, uint amount, uint price) public {
     

        if (side == Side.BUY) {

          side = Side.SELL;
        }else {

          side = Side.BUY;
        }
        //handle first case for LimitOrderBook[ticker][uint(side)] if it is buy(We must have enough eth to make the LimitOrderBook[ticker][uint(side)]
        //the balances mapping is inherited from our wallet contrac
        if (side == Side.BUY) {

          require(balances[msg.sender]["ETH"] >= amount * price);
          //require(balances[msg.sender][ticker] >= amount);

          //create new order instance for the buy side
          Order[] storage newOrder = LimitOrderBook[ticker][uint(side)];
          newOrder.push(Order(msg.sender, ticker, amount, side, id, price, false));

          settleOrders(ticker, side);
          

        }else {

          require(balances[msg.sender][ticker] >= amount * price);
          //require(balances[msg.sender][ticker] >= amount);

          Order[] storage newOrder = LimitOrderBook[ticker][uint(side)];
          newOrder.push(Order(msg.sender, ticker, amount, side, id, price, false));

          settleOrders(ticker, side);

         
          
        }

    }

    function settleOrders(string memory ticker, Side side) internal {

      Order[] storage LimitOrder;
      Order[] storage newOrder;
      if (side == Side.BUY) {

        LimitOrder = LimitOrderBook[ticker][uint(Side.SELL)];
        newOrder = LimitOrderBook[ticker][uint(Side.BUY)];

      }else {

        LimitOrder = LimitOrderBook[ticker][uint(Side.BUY)];
        newOrder = LimitOrderBook[ticker][uint(Side.SELL)];
      }
      
      uint i = 0;
      uint cost = 0;
      uint fillAmount;
      while (newOrder.length > 0) {
            
            //handle case when limit order book is empty
            if (LimitOrder.length == 0) {
              break;
            }
            //handle case when market order amount == limit order amt
            if (newOrder[i].amount == LimitOrder[i].amount) {
                fillAmount = 0;
                fillAmount = newOrder[i].amount;
                newOrder[i].amount -= newOrder[i].amount;
                LimitOrder[i].amount -= LimitOrder[i].amount;
                newOrder[i].filled = true;
                LimitOrder[i].filled = true;
                cost = fillAmount * LimitOrder[i].price;
               
               
              }

              //handle case when limit order < market order
              else if (newOrder[i].amount > LimitOrder[i].amount) {
                fillAmount = 0;
                fillAmount = LimitOrder[i].amount;
                newOrder[i].amount -= LimitOrder[i].amount;
                LimitOrder[i].amount -= LimitOrder[i].amount;
                LimitOrder[i].filled = true;
                cost = fillAmount * LimitOrder[i].price;
              }

              //handle case when limit order > market order
              else if (newOrder[i].amount < LimitOrder[i].amount) {
                fillAmount = 0;
                fillAmount = newOrder[i].amount;
                newOrder[i].amount -= newOrder[i].amount;
                LimitOrder[i].amount -= newOrder[i].amount;
                newOrder[i].filled = true;
                cost = fillAmount * LimitOrder[i].price;
               
              }

              // cost = fillAmount * LimitOrder[i].price;
              // //transfer funds and update balances
              if (side == Side.SELL) {

                balances[LimitOrder[i].trader][ticker] += fillAmount;
                balances[LimitOrder[i].trader]["ETH"] -= cost;

                balances[newOrder[i].trader][ticker] -= fillAmount;
                balances[newOrder[i].trader]["ETH"] += cost;

              }else {

                balances[LimitOrder[i].trader][ticker] -= fillAmount;
                balances[LimitOrder[i].trader]["ETH"] += cost;

                balances[newOrder[i].trader][ticker] += fillAmount;
                balances[newOrder[i].trader]["ETH"] -= cost;
              }
              

              if (newOrder[i].filled) {
                  newOrder[i] = newOrder[newOrder.length - 1];
                  newOrder.pop();
              }

              if (LimitOrder[i].filled) {
                LimitOrder[i] = LimitOrder[LimitOrder.length - 1];
                LimitOrder.pop();
                
            }      


          }
          
    }

   
    function sortOrder(Side side, string memory ticker, int low, int high) public {
     // side = Side.BUY;
      if (side == Side.BUY) {

        if (low < high) {
          int pivot = int(LimitOrderBook[ticker][uint(side)][uint(high)].price);
          int i = (low-1); // index of smaller element
          for (int j = low; j < high; j++) {
            if (int(LimitOrderBook[ticker][uint(side)][uint(j)].price) <= pivot) {
              i++;
              if (i != j) {
                LimitOrderBook[ticker][uint(side)][uint(i)].price ^= LimitOrderBook[ticker][uint(side)][uint(j)].price;
                LimitOrderBook[ticker][uint(side)][uint(j)].price ^= LimitOrderBook[ticker][uint(side)][uint(i)].price;
                LimitOrderBook[ticker][uint(side)][uint(i)].price ^= LimitOrderBook[ticker][uint(side)][uint(j)].price;
              }
            }
          }
          if (i+1 != high) {
            LimitOrderBook[ticker][uint(side)][uint(i+1)].price ^= LimitOrderBook[ticker][uint(side)][uint(high)].price;
            LimitOrderBook[ticker][uint(side)][uint(high)].price ^= LimitOrderBook[ticker][uint(side)][uint(i+1)].price;
            LimitOrderBook[ticker][uint(side)][uint(i+1)].price ^= LimitOrderBook[ticker][uint(side)][uint(high)].price;
          }
          pivot = i + 1;
          sortOrder(side, ticker, low, pivot-1);
          sortOrder(side, ticker, pivot+1, high);

        }
      } else {
          if (low < high) {
            int pivot = int(LimitOrderBook[ticker][uint(side)][uint(high)].price);
            int i = (low-1); // index of smaller element
            for (int j = low; j < high; j++) {
              if (int(LimitOrderBook[ticker][uint(side)][uint(j)].price) >= pivot) {
                i++;
                if (i != j) {
                  LimitOrderBook[ticker][uint(side)][uint(i)].price ^= LimitOrderBook[ticker][uint(side)][uint(j)].price;
                  LimitOrderBook[ticker][uint(side)][uint(j)].price ^= LimitOrderBook[ticker][uint(side)][uint(i)].price;
                  LimitOrderBook[ticker][uint(side)][uint(i)].price ^= LimitOrderBook[ticker][uint(side)][uint(j)].price;
                }
              }
            }
            if (i+1 != high) {
              LimitOrderBook[ticker][uint(side)][uint(i+1)].price ^= LimitOrderBook[ticker][uint(side)][uint(high)].price;
              LimitOrderBook[ticker][uint(side)][uint(high)].price ^= LimitOrderBook[ticker][uint(side)][uint(i+1)].price;
              LimitOrderBook[ticker][uint(side)][uint(i+1)].price ^= LimitOrderBook[ticker][uint(side)][uint(high)].price;
            }
            pivot = i + 1;
            sortOrder(side, ticker, low, pivot-1);
            sortOrder(side, ticker, pivot+1, high);

      }
      
      }
    }

}

