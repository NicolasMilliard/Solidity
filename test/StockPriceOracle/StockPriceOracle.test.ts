import { expect } from "chai";
import hre from "hardhat";
import type { Signer } from "ethers";
import type { StockPriceOracle } from "../../typechain-types";

describe("StockPriceOracle", () => {
  let owner: Signer;
  let externalSource: Signer;
  let stockPriceOracle: StockPriceOracle;

  const symbol = "AAPL";
  const nbDecimals = 2;

  beforeEach(async () => {
    [owner, externalSource] = await hre.ethers.getSigners();

    const StockPriceOracleFactory = await hre.ethers.getContractFactory("StockPriceOracle");
    stockPriceOracle = await StockPriceOracleFactory.deploy(symbol, nbDecimals);
    await stockPriceOracle.waitForDeployment();
  });

  it("should deploy with the correct owner and initial values", async () => {
    expect(await stockPriceOracle.owner()).to.equal(await owner.getAddress());
  });

  it("should allow the owner to update the stock price", async () => {
    const newPrice = hre.ethers.parseUnits("1500.50", nbDecimals);
    const tx = await stockPriceOracle.connect(owner).setUpdatedPrice(newPrice, 0);
    await tx.wait();

    const events = await stockPriceOracle.queryFilter(stockPriceOracle.filters.StockPriceUpdated());
    expect(events.length).to.equal(1);

    const eventArgs = events[0].args;
    expect(eventArgs.stockPrice).to.equal(newPrice);
    expect(eventArgs.lastUpdatedTimestamp).to.be.gt(0);
  });

  it("should not allow non-owners to update the stock price", async () => {
    const newPrice = hre.ethers.parseUnits("1500.50", nbDecimals);
    await expect(stockPriceOracle.connect(externalSource).setUpdatedPrice(newPrice, 0)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
