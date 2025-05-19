const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  let NFTMarket, owner, addr1, addr2;

  beforeEach(async function () {
    NFTMarket = await ethers.deployContract("NFTMarket");
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should set the right owner", async function () {
    expect(await NFTMarket.marketplaceOwner()).to.equal(owner.address);
  });

  it("Should create a new token and listing", async function () {
    const tokenURI = "https://example.com/nft";
    const price = ethers.parseEther("1");

    await NFTMarket.createToken(tokenURI, price);
    const listing = await NFTMarket.getNFTListing(1);

    expect(listing.tokenId).to.equal(1);
    expect(listing.owner).to.equal(owner.address);
    expect(listing.price).to.equal(price);
  });

  it("Should prevent reentrancy attacks", async function () {
    // Add reentrancy test logic
  });

  it("Should emit TokenCreated event", async function () {
    const tx = await NFTMarket.createToken("https://example.com/nft", ethers.parseEther("1"));
    await expect(tx).to.emit(NFTMarket, "TokenCreated");
  });
});