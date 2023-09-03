// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StockPriceOracle
 * @author Nicolas Milliard
 * @notice Allow an external source to update the price of a stock
 */
contract StockPriceOracle is Ownable {
    string public symbol;
    /**
     @dev stockPrice is stored as an integer with its decimals.
     */
    uint256 stockPrice;
    uint256 lastUpdatedTimestamp;
    uint256 public nbDecimals;

    event StockPriceUpdated(uint256 stockPrice, uint256 lastUpdatedTimestamp);

    constructor(string memory _symbol, uint256 _nbDecimals) {
        symbol = _symbol;
        nbDecimals = _nbDecimals;
    }

    /**
     @notice Set the updated stock price
     @param _newPrice has to be sent with the right number of decimals even if their values are 0
     @param _lastUpdatedTimestamp is optionnal but hihgly recommanded
     */
    function setUpdatedPrice(
        uint256 _newPrice,
        uint256 _lastUpdatedTimestamp
    ) external onlyOwner {
        stockPrice = _newPrice;

        /**
         @dev Check if _lastUpdatedTimestamp has a specific value
         */
        _lastUpdatedTimestamp == 0
            ? lastUpdatedTimestamp = block.timestamp
            : lastUpdatedTimestamp = _lastUpdatedTimestamp;

        emit StockPriceUpdated(stockPrice, lastUpdatedTimestamp);
    }
}
