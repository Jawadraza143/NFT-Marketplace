import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FaCube, FaEthereum } from "react-icons/fa";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

const CONTRACT_ADDRESS = "0xYourSmartContractAddress"; // Replace with your contract address
const ABI = []; // Replace with your contract ABI

import PropTypes from 'prop-types';

const FloatingCube = ({ x, y, delay }) => (
  <motion.div
    className="absolute text-sky-400/20"
    initial={{ scale: 0, rotate: 0 }}
    animate={{ 
      scale: [0, 1, 0],
      rotate: 360,
      x: [0, x * 2, 0],
      y: [0, y * 2, 0]
    }}
    transition={{
      duration: 10 + delay,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    <FaCube className="text-4xl" />
  </motion.div>
);

function SellNFT() {
  const [nftId, setNftId] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null); // State for image preview
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 800], [15, -15]);
  const rotateY = useTransform(x, [0, 800], [-15, 15]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Set image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Input validation
    if (!nftId || !salePrice) {
      toast.error("Please fill all fields");
      return;
    }

    if (!window.ethereum) {
      toast.error("MetaMask is not installed!");
      return;
    }

    setIsLoading(true);
    try {
      // Ethereum provider setup
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Estimate gas
      const priceInWei = ethers.parseEther(salePrice);
      const gasEstimate = await contract.estimateGas.listNFT(nftId, priceInWei, currency);
      
      // Contract interaction
      const tx = await contract.listNFT(nftId, priceInWei, currency, {
        gasLimit: gasEstimate
      });
      
      await tx.wait();
      toast.success("NFT listed successfully! 🎉");
      navigate("/marketplace");
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error.message.split("(")[0]}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex overflow-hidden relative flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-br from-gray-100 to-sky-100"
      onMouseMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      {/* Floating Cubes Background */}
      {[...Array(8)].map((_, i) => (
        <FloatingCube key={i} x={Math.random() * 100 - 50} y={Math.random() * 100 - 50} delay={i * 2} />
      ))}

      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          background: [
            "linear-gradient(45deg, #f0f4f8, #e6f7ff, #ebf8ff, #f0f4f8)",
            "linear-gradient(45deg, #e6f7ff, #ebf8ff, #f0f4f8, #e6f7ff)",
            "linear-gradient(45deg, #ebf8ff, #f0f4f8, #e6f7ff, #ebf8ff)",
            "linear-gradient(45deg, #f0f4f8, #e6f7ff, #ebf8ff, #f0f4f8)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <motion.div 
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="overflow-hidden relative z-10 p-8 w-full max-w-sm text-gray-800 rounded-2xl border shadow-2xl backdrop-blur-xl border-sky-400/30 bg-white/50"
      >
        {/* Spinning Icons with Framer Motion */}
        <motion.h1
          className="flex gap-3 justify-center items-center mb-6 text-3xl font-bold text-center text-sky-600"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <FaCube className="text-sky-600" />
          </motion.div>
          Sell Your NFT
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <FaCube className="text-sky-600" />
          </motion.div>
        </motion.h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* NFT ID Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block mb-2 text-sm font-medium">
              NFT ID
            </label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.05 }}
              type="text"
              value={nftId}
              onChange={(e) => setNftId(e.target.value)}
              className="p-3 w-full text-gray-800 rounded-lg border-2 transition-all bg-white/70 border-sky-400/30 focus:outline-none focus:border-sky-500"
              placeholder="Enter NFT ID"
              required
            />
          </motion.div>

          {/* Sale Price Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-2 text-sm font-medium">
              Sale Price (in {currency})
            </label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.05 }}
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="p-3 w-full text-gray-800 rounded-lg border-2 transition-all bg-white/70 border-sky-400/30 focus:outline-none focus:border-sky-500"
              placeholder="Enter price"
              required
            />
          </motion.div>

          {/* Currency Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex gap-2">
              {['ETH', 'DAI', 'USDC'].map((curr) => (
                <motion.button
                  key={curr}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                    currency === curr 
                      ? 'border-sky-500 bg-sky-500/20' 
                      : 'border-sky-400/30 hover:border-sky-400/50'
                  }`}
                  onClick={() => setCurrency(curr)}
                >
                  <span className="flex gap-2 justify-center items-center">
                    {curr === 'ETH' && <FaEthereum className="text-sky-600" />}
                    {curr}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label className="block mb-2 text-sm font-medium">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-3 w-full text-gray-800 rounded-lg border-2 transition-all bg-white/70 border-sky-400/30 focus:outline-none focus:border-sky-500"
            />
            {image && (
              <img src={image} alt="Preview" className="mt-2 rounded-lg" />
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            type="submit"
            disabled={isLoading}
            className="overflow-hidden relative py-3 w-full font-bold text-white bg-gradient-to-r from-sky-500 to-emerald-600 rounded-lg"
          >
            <div className="flex relative z-10 gap-2 justify-center items-center">
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  Processing...
                </div>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">
                  List NFT
                </span>
              )}
            </div>
          </motion.button>
        </form>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex absolute top-5 left-5 z-50 gap-4 p-3 rounded-lg border backdrop-blur-sm bg-white/80 border-green-400/30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex gap-2 items-center text-green-600 hover:text-green-500"
          onClick={() => navigate(-1)}
        >
          <span className="text-xl">←</span>
          <span className="text-sm">Back</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex gap-2 items-center text-green-600 hover:text-green-500"
          onClick={() => navigate("/")}
        >
          <span className="text-xl">🏠</span>
          <span className="text-sm">Home</span>
        </motion.button>
      </div>
    </div>
  );
}

FloatingCube.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
};

export default SellNFT;