import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";

function ExplorePage() {
  const navigate = useNavigate();
  const keywords = ["NFTs", "Blockchain", "Crypto", "Web3", "DeFi", "Metaverse"];
  const images = [
    "https://cdn-icons-png.flaticon.com/512/873/873120.png", // Crypto Coin
    "https://cdn-icons-png.flaticon.com/512/7336/7336937.png", // Blockchain
    "https://cdn-icons-png.flaticon.com/512/9276/9276819.png", // NFT
    "https://cdn-icons-png.flaticon.com/512/9077/9077892.png", // Wallet
    "https://cdn-icons-png.flaticon.com/512/9008/9008491.png", // Web3
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30 animate-pulse"></div>

      {/* Floating Blockchain Keywords & Stickers */}
      <div className="absolute inset-0">
        {keywords.map((word, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", rotate: 0, opacity: 0.5 }}
            animate={{
              y: ["100vh", "-10vh"],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute text-4xl font-bold text-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {/* Extra Text Content with fade-in effect */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="px-10 mb-6 text-lg text-center text-gray-100"
      >
        Discover a world of digital ownership, creativity, and limitless
        possibilities. Start your journey in the NFT marketplace today! 💎
      </motion.p>

      {/* Main Content Card with hover effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 p-10 text-center transition-all duration-300 border shadow-lg bg-white/10 backdrop-blur-lg rounded-3xl border-white/20 hover:shadow-2xl hover:scale-105"
      >
        <p className="mb-6 text-lg text-gray-300">Choose an option below:</p>
        <div className="flex space-x-6">
          {/* Mint NFT Button with spin effect */}
          <motion.button
            onClick={() => navigate("/mint")}
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            className="relative px-8 py-3 overflow-hidden font-semibold text-white transition-all duration-300 bg-gray-800 border border-gray-600 shadow-lg rounded-xl hover:border-gray-400 hover:bg-gray-700"
          >
            <span className="absolute inset-0 transition-opacity duration-300 bg-gray-600 opacity-0 hover:opacity-30 rounded-xl"></span>
            Mint NFT
          </motion.button>

          {/* Sell NFT Button with spin effect */}
          <motion.button
            onClick={() => navigate("/sell")}
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            className="relative px-8 py-3 overflow-hidden font-semibold text-white transition-all duration-300 bg-green-600 border border-green-400 shadow-lg rounded-xl hover:border-green-200 hover:bg-green-700"
          >
                        <span className="absolute inset-0 transition-opacity duration-300 bg-green-500 opacity-0 hover:opacity-30 rounded-xl"></span>
            Sell NFT
          </motion.button>

          {/* Buy NFT Button with spin effect */}
          <motion.button
            onClick={() => navigate("/buy")}
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            className="relative px-8 py-3 overflow-hidden font-semibold text-white transition-all duration-300 bg-blue-600 border border-blue-400 shadow-lg rounded-xl hover:border-blue-200 hover:bg-blue-700"
          >
            <span className="absolute inset-0 transition-opacity duration-300 bg-blue-500 opacity-0 hover:opacity-30 rounded-xl"></span>
            Buy NFT
          </motion.button>
        </div>
      </motion.div>

      {/* Redesigned Animated 3D "Back" Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center px-8 py-4 mt-10 text-2xl font-bold text-white transition-all duration-500 transform bg-red-600 border border-red-400 rounded-full shadow-2xl hover:border-red-200 hover:bg-red-700 perspective-1000"
      >
        <span className="mr-2">⬅</span> Go Back
      </motion.button>
    </div>
  );
}

export default ExplorePage;