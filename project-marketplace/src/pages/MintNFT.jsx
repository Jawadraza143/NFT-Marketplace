import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { FaCube, FaWallet, FaImage, FaEthereum } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from 'prop-types';
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { ethers } from "ethers";

// Get contract address from environment variable
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Contract ABI
const ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_tokenURI",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Animated floating cube component
const FloatingCube = ({ x, y, delay }) => (
  <motion.div
    className="absolute text-indigo-400/20"
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

FloatingCube.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
};

function MintNFT() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [image, setImage] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  // Motion values for 3D perspective effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 800], [15, -15]);
  const rotateY = useTransform(x, [0, 800], [-15, 15]);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast.success("Wallet account changed!");
        } else {
          setAccount(null);
          toast.info("Wallet disconnected");
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !description || !price || !image) {
      toast.error("Please fill all fields");
      return;
    }

    if (!account) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (!window.ethereum) {
      toast.error("Please install MetaMask!");
      return;
    }

    try {
      // First, upload image to IPFS
      const imageData = new FormData();
      const imageFile = await fetch(image).then(r => r.blob());
      imageData.append('file', imageFile);
      
      const imageResponse = await uploadFileToIPFS(imageData);
      if (!imageResponse.success) {
        throw new Error("Failed to upload image to IPFS");
      }

      // Create and upload metadata to IPFS
      const metadata = {
        name: name,
        description: description,
        image: imageResponse.pinataURL
      };

      const metadataResponse = await uploadJSONToIPFS(metadata);
      if (!metadataResponse.success) {
        throw new Error("Failed to upload metadata to IPFS");
      }

      // Get contract instance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Convert price to wei
      const priceInWei = ethers.parseEther(price);

      // Show pending toast
      toast.info("Please confirm the transaction in your wallet...");

      // Call createToken function
      const tx = await contract.createToken(metadataResponse.pinataURL, priceInWei);
      
      // Show processing toast
      const processingToast = toast.loading("Processing your NFT mint transaction...");
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Update toast
      toast.update(processingToast, {
        render: "NFT minted successfully! 🎉",
        type: "success",
        isLoading: false,
        autoClose: 5000
      });

      // Clear form
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);

      // Navigate to marketplace after short delay
      setTimeout(() => {
        navigate("/marketplace");
      }, 2000);

    } catch (error) {
      console.error("Minting error:", error);
      toast.error(error.message || "Failed to mint NFT");
    }
  };

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        toast.success("Wallet connected successfully!");
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast.error("Failed to connect wallet: " + error.message);
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    toast.success("Wallet disconnected successfully!");
  };

  return (
    <div 
      className="flex overflow-hidden relative flex-col justify-center items-center p-4 min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900"
      onMouseMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      {/* Animated Background Elements */}
      {[...Array(12)].map((_, i) => (
        <FloatingCube key={i} x={Math.random() * 100 - 50} y={Math.random() * 100 - 50} delay={i * 2} />
      ))}

      {/* Animated Gradient Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          background: [
            "linear-gradient(45deg, #312e81, #4c1d95, #312e81)",
            "linear-gradient(45deg, #4c1d95, #312e81, #4c1d95)",
            "linear-gradient(45deg, #312e81, #4c1d95, #312e81)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Form Container with 3D Effect */}
      <motion.div 
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="overflow-hidden relative z-10 p-8 w-full max-w-md text-white rounded-2xl border shadow-2xl backdrop-blur-xl border-indigo-500/30 bg-indigo-900/30"
      >
        {/* Title with Spinning Icons */}
        <motion.h1
          className="flex gap-3 justify-center items-center mb-8 text-3xl font-bold text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <FaCube className="text-indigo-400" />
          </motion.div>
          Mint Your NFT
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <FaCube className="text-indigo-400" />
          </motion.div>
        </motion.h1>

        {/* Wallet Connection Section */}
        <div className="mb-6 text-center">
          {account ? (
            <div className="flex flex-col items-center gap-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-indigo-300"
              >
                Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectWallet}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Disconnect Wallet
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg"
            >
              Connect Wallet
            </motion.button>
          )}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block mb-2 text-sm font-medium text-indigo-300">
              Name
            </label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.05 }}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 w-full text-white rounded-lg border-2 transition-all bg-indigo-900/50 border-indigo-500/30 focus:outline-none focus:border-indigo-400"
              placeholder="Enter NFT Name"
              required
            />
          </motion.div>

          {/* Description Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block mb-2 text-sm font-medium text-indigo-300">
              Description
            </label>
            <motion.textarea
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.05 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 w-full h-24 text-white rounded-lg border-2 transition-all bg-indigo-900/50 border-indigo-500/30 focus:outline-none focus:border-indigo-400"
              placeholder="Enter NFT Description"
              required
            />
          </motion.div>

          {/* Price Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-2 text-sm font-medium text-indigo-300">
              Price
            </label>
            <div className="flex gap-2">
              <motion.input
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.05 }}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-3 w-full text-white rounded-lg border-2 transition-all bg-indigo-900/50 border-indigo-500/30 focus:outline-none focus:border-indigo-400"
                placeholder="Enter Price"
                required
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="p-3 text-white rounded-lg border-2 transition-all bg-indigo-900/50 border-indigo-500/30 focus:outline-none focus:border-indigo-400"
              >
                <option value="ETH">ETH</option>
                <option value="MATIC">MATIC</option>
                <option value="BNB">BNB</option>
              </select>
            </div>
          </motion.div>

          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block mb-2 text-sm font-medium text-indigo-300">
              Upload Image
            </label>
            <motion.input
              whileHover={{ scale: 1.02 }}
              type="file"
              onChange={handleImageChange}
              className="p-3 w-full text-white rounded-lg border-2 transition-all bg-indigo-900/50 border-indigo-500/30 focus:outline-none focus:border-indigo-400"
              accept="image/*"
            />
            {image && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={image}
                alt="Preview"
                className="mt-4 w-full rounded-lg"
              />
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="relative w-full py-4 mt-8 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-xl overflow-hidden group"
          >
            <span className="relative z-10">Mint NFT</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </form>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex absolute top-5 left-5 z-50 gap-4 p-3 rounded-lg border backdrop-blur-sm bg-indigo-900/20 border-indigo-500/30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex gap-2 items-center text-indigo-300 hover:text-indigo-200"
          onClick={() => navigate(-1)}
        >
          <span className="text-xl">←</span>
          <span className="text-sm">Back</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex gap-2 items-center text-indigo-300 hover:text-indigo-200"
          onClick={() => navigate("/")}
        >
          <span className="text-xl">🏠</span>
          <span className="text-sm">Home</span>
        </motion.button>
      </div>
    </div>
  );
}

export default MintNFT;