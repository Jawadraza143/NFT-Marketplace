import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import contractABI from '../contract/contractABI.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

function NFTDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNFTDetails();
  }, [id]);

  const fetchNFTDetails = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);

      // Get NFT details
      const nftListing = await contract.getNFTListing(id);
      const tokenURI = await contract.tokenURI(id);
      const metadata = await fetch(tokenURI).then(res => res.json());
      
      setNft({
        id: nftListing.tokenId.toString(),
        title: metadata.name,
        description: metadata.description,
        price: ethers.formatEther(nftListing.price.toString()),
        image: metadata.image,
        seller: nftListing.seller
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching NFT details:", error);
      setLoading(false);
      toast.error("Error loading NFT details");
    }
  };

  const handleBuy = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      // Execute the purchase
      const tx = await contract.executeSale(id, {
        value: ethers.parseEther(nft.price)
      });

      toast.info("Processing purchase...");
      await tx.wait();
      
      toast.success("NFT purchased successfully!");
      navigate("/marketplace");
    } catch (error) {
      console.error("Error buying NFT:", error);
      toast.error("Error purchasing NFT: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-green-500 animate-spin"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">NFT not found</div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="overflow-hidden mx-auto max-w-4xl bg-gray-800 rounded-lg shadow-xl">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={nft.image}
                alt={nft.title}
                className="object-cover w-full h-96"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="mb-4 text-3xl font-bold text-white">{nft.title}</h1>
                <p className="mb-6 text-gray-300">{nft.description}</p>
                <div className="mb-6">
                  <p className="text-2xl font-bold text-green-400">{nft.price} ETH</p>
                  <p className="mt-2 text-gray-400">
                    Seller: {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBuy}
                  className="px-6 py-3 w-full text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600"
                >
                  Buy Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/marketplace')}
                  className="px-6 py-3 mt-4 w-full text-white bg-gray-700 rounded-lg transition-colors hover:bg-gray-600"
                >
                  Back to Marketplace
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTDetail; 