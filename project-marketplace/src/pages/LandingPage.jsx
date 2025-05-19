import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCube, FaRocket, FaGithub, FaTwitter, FaDiscord, FaShieldAlt, FaUserSecret, FaChartLine, FaWallet, FaSignOutAlt, FaUser, FaEthereum, FaBitcoin, FaGlobe } from "react-icons/fa";
import { MdSpeed, MdTrendingUp } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Floating Element Component with PropTypes
import PropTypes from 'prop-types';

const FloatingElement = ({ x, y, delay, children }) => (
  <motion.div
    className="absolute text-indigo-500/20"
    initial={{ scale: 0, rotate: 0 }}
    animate={{ 
      scale: [0.5, 1.5, 0.5],
      rotate: 360,
      x: [0, x, 0],
      y: [0, y, 0]
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

FloatingElement.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

function LandingPage() {
  const navigate = useNavigate();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const features = [
    { icon: <FaEthereum />, title: "Ethereum Powered", desc: "Built on secure blockchain" },
    { icon: <FaBitcoin />, title: "Multi-Chain", desc: "Support for multiple networks" },
    { icon: <FaGlobe />, title: "Global Market", desc: "Trade worldwide" },
    { icon: <FaCube />, title: "Unique NFTs", desc: "One-of-a-kind digital assets" }
  ];

  const socialLinks = [
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaDiscord />, href: "https://discord.gg", label: "Discord" },
    { icon: <FaGithub />, href: "https://github.com", label: "GitHub" }
  ];

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsWalletConnected(true);
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
          setIsWalletConnected(true);
        } else {
          setAccount("");
          setIsWalletConnected(false);
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsWalletConnected(true);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error(error.message || "Error connecting wallet");
    }
  };

  const handleLogout = () => {
    setAccount("");
    setIsWalletConnected(false);
    setShowProfileMenu(false);
    toast.success("Wallet disconnected successfully!");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickOutside = (e) => {
    if (showProfileMenu && !e.target.closest('.profile-menu')) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <div className="overflow-hidden relative min-h-screen text-white bg-gray-900">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isSticky ? "py-2 backdrop-blur-xl bg-black/90" : "py-4 bg-transparent"
      }`}>
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <motion.h1 
              className="text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
            >
              NFT<span className="text-blue-500">Market</span>
            </motion.h1>
            <div className="flex items-center space-x-6">
              {/* Profile Button */}
              <motion.button
                onClick={() => navigate("/settings")}
                className="flex gap-2 items-center px-4 py-2 text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser className="text-lg" />
                Profile
              </motion.button>

              {/* Wallet Connection */}
              {isWalletConnected ? (
                <div className="relative profile-menu">
                  <motion.button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaWallet className="text-lg" />
                    <span className="hidden md:inline">
                      {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                    </span>
                  </motion.button>

                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 py-2 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl"
                    >
                      <motion.button
                        onClick={handleLogout}
                        className="flex gap-2 items-center px-4 py-2 w-full text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                        whileHover={{ x: 5 }}
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span>Disconnect</span>
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.button
                  onClick={connectWallet}
                  className="flex gap-2 items-center px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaWallet className="text-lg" />
                  Connect Wallet
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-20">
        {/* Enhanced animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, #4F46E5 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #4F46E5 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, #4F46E5 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, #4F46E5 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Light beam effect */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              "linear-gradient(-45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated floating elements */}
        {[...Array(12)].map((_, i) => (
          <FloatingElement
            key={i}
            x={Math.random() * 400 - 200}
            y={Math.random() * 400 - 200}
            delay={i * 0.5}
          >
            {i % 4 === 0 ? <FaEthereum className="text-5xl" /> :
             i % 4 === 1 ? <FaBitcoin className="text-5xl" /> :
             i % 4 === 2 ? <FaGlobe className="text-5xl" /> :
             <FaCube className="text-5xl" />}
          </FloatingElement>
        ))}

        <div className="container relative z-10 mx-auto text-center">
          {/* Main Title with Enhanced Gradient Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h1
              className="mb-6 text-6xl font-extrabold tracking-tight"
              style={{
                background: "linear-gradient(to right, #60A5FA, #8B5CF6, #EC4899, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "300% 300%",
                textShadow: "0 0 40px rgba(99, 102, 241, 0.3)"
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Next-Gen NFT Marketplace
            </motion.h1>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mx-auto mb-12 max-w-2xl text-2xl font-medium leading-relaxed backdrop-blur-sm text-gray-300/90"
          >
            Discover, Create, and Trade Unique Digital Assets on the Most Secure and Advanced NFT Platform
          </motion.p>

          {/* Enhanced Call-to-Action Buttons */}
          <div className="flex gap-8 justify-center mb-16">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 50px rgba(59, 130, 246, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              onClick={() => navigate("/marketplace")}
              className="flex overflow-hidden relative gap-3 items-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r rounded-xl shadow-lg backdrop-blur-md from-blue-600/90 to-blue-800/90 group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 from-blue-400/50 to-blue-600/50 group-hover:opacity-100"
              />
              <FaRocket className="relative z-10 text-2xl group-hover:animate-bounce" />
              <span className="relative z-10">Explore NFTs</span>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 50px rgba(168, 85, 247, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              onClick={() => navigate("/mint")}
              className="flex overflow-hidden relative gap-3 items-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r rounded-xl shadow-lg backdrop-blur-md from-purple-600/90 via-fuchsia-500/90 to-pink-600/90 group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 from-purple-400/50 to-pink-400/50 group-hover:opacity-100"
              />
              <FaCube className="relative z-10 text-2xl" />
              <span className="relative z-10">Start Creating</span>
            </motion.button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-6 mt-20 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-xl border border-gray-700 backdrop-blur-lg bg-gray-800/50"
                onMouseEnter={() => setHoveredIcon(index)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <motion.div
                  className="mb-4 text-4xl text-indigo-400"
                  animate={hoveredIcon === index ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                    color: ["#818CF8", "#C084FC", "#818CF8"]
                  } : {}}
                  transition={{ duration: 1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gray-900">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12 text-3xl font-bold text-center"
          >
            Revolutionary Features
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="p-6 rounded-lg border border-gray-700 transition-colors duration-300 bg-gray-800/50 hover:border-blue-500/30"
              >
                <div className="mb-4 text-blue-400">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-3xl font-bold text-center"
          >
            What Our Users Say
          </motion.h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Alex Thompson",
                role: "Digital Artist",
                image: "https://randomuser.me/api/portraits/men/1.jpg",
                review: "The platform's security and ease of use are unmatched. I've sold multiple NFT collections here with great success!",
                rating: 5
              },
              {
                name: "Sarah Chen",
                role: "NFT Collector",
                image: "https://randomuser.me/api/portraits/women/2.jpg",
                review: "Best marketplace I've used. The analytics tools help me make informed decisions about my investments.",
                rating: 5
              },
              {
                name: "Michael Rodriguez",
                role: "Crypto Investor",
                image: "https://randomuser.me/api/portraits/men/3.jpg",
                review: "The multi-wallet support and lightning-fast transactions make trading NFTs a breeze.",
                rating: 5
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="p-6 bg-gradient-to-br rounded-xl border border-gray-700 backdrop-blur-sm from-gray-800/50 to-gray-900/50"
              >
                <div className="flex items-center mb-4">
                  <motion.img
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.2 }}
                    src={review.image}
                    alt={review.name}
                    className="mr-4 w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{review.name}</h3>
                    <p className="text-blue-400">{review.role}</p>
                  </div>
                </div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.4 }}
                  className="mb-4 text-gray-300"
                >
                  "{review.review}"
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.6 }}
                  className="flex text-yellow-400"
                >
                  {[...Array(review.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ rotate: -180, opacity: 0 }}
                      whileInView={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.6 + i * 0.1 }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/marketplace")}
              className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
            >
              Join Our Community
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto">
          {/* Newsletter Section */}
          <div className="p-8 mb-12 rounded-2xl border border-gray-700 bg-gray-800/50">
            <h3 className="mb-4 text-2xl font-bold">Stay in the Loop</h3>
            <p className="mb-6 text-gray-400">Join our mailing list to stay updated with our newest features, NFT drops, and trading tips.</p>
            <form className="flex gap-4 max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              >
                Sign up
              </motion.button>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Marketplace Column */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Marketplace</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Art</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Gaming</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Memberships</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">PFPs</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Photography</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Music</a></li>
              </ul>
            </div>

            {/* My Account Column */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">My Account</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Profile</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Favorites</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Watchlist</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Studio</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Settings</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Learn</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Community</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Platform Status</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Ventures</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 transition-colors hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-8 justify-center pt-8 mt-12 border-t border-gray-800">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors duration-200 hover:text-white"
                title={link.label}
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="mt-8 text-sm text-center text-gray-500">
            © 2024 NFT Market Place. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage; 