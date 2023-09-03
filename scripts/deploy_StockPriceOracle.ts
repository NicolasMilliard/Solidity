import hre from "hardhat";
import { ethers } from "hardhat";
import type { StockPriceOracle } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Owner of StockPriceOracle:", deployer.address);

  const symbol = "ETH"; // Replace with the desired symbol
  const nbDecimals = 16; // Replace with the number of decimals you want

  // Deploy StockPriceOracle contract
  const StockPriceOracleFactory = await hre.ethers.getContractFactory("StockPriceOracle");
  const stockPriceOracle: StockPriceOracle = await StockPriceOracleFactory.deploy(symbol, nbDecimals);

  await stockPriceOracle.waitForDeployment();

  console.log("StockPriceOracle deployed to:", stockPriceOracle.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
