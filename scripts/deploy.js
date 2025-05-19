const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  
  // Deploy the contract
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.waitForDeployment();

  const address = await nftMarket.getAddress();
  console.log("NFT Marketplace deployed to:", address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 