import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import contractABI from '../contract/contractABI.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

function NFTGrid() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      console.log("Fetching NFTs...");
      console.log("Contract Address:", CONTRACT_ADDRESS);
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);

      // Get all listed NFTs
      console.log("Calling getAllListedNFTs...");
      const listedNFTs = await contract.getAllListedNFTs();
      console.log("Listed NFTs:", listedNFTs);
      
      // Transform the NFT data
      const items = await Promise.all(
        listedNFTs
          .filter(nft => nft.tokenId.toString() !== "0") // Filter out invalid NFTs
          .map(async (nft) => {
            try {
              console.log("Processing NFT:", nft.tokenId.toString());
              
              // Fetch token URI
              const tokenURI = await contract.tokenURI(nft.tokenId);
              console.log("Token URI:", tokenURI);
              
              // Fetch metadata from IPFS
              const response = await fetch(tokenURI);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const metadata = await response.json();
              console.log("Metadata:", metadata);
              
              const price = ethers.formatEther(nft.price.toString());
              
              return {
                id: nft.tokenId.toString(),
                title: metadata.name || "Untitled",
                description: metadata.description || "No description",
                price: `${price} ETH`,
                image: metadata.image,
                seller: nft.seller
              };
            } catch (error) {
              console.error("Error processing NFT:", nft.tokenId.toString(), error);
              return null;
            }
          })
      );

      // Filter out failed NFTs
      const validNFTs = items.filter(item => item !== null);
      console.log("Processed NFTs:", validNFTs);
      
      setNfts(validNFTs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast.error(error.message || "Error loading NFTs");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-green-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container px-4 mx-auto">
        <h2 className="mb-8 text-4xl font-bold text-center text-white">
          {nfts.length > 0 ? "Available NFTs" : "No NFTs Listed Yet"}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {nfts.map((nft) => (
            <motion.div
              key={nft.id}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden bg-gray-800 rounded-lg shadow-lg"
            >
              <img
                src={nft.image}
                alt={nft.title}
                className="object-cover w-full h-64"
              />
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">{nft.title}</h3>
                <p className="mb-4 text-gray-300">{nft.description}</p>
                <p className="font-semibold text-green-400">{nft.price}</p>
                <p className="mt-2 text-sm text-gray-400">
                  Seller: {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 mt-4 w-full text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600"
                  onClick={() => window.location.href = `/nft/${nft.id}`}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NFTGrid;
