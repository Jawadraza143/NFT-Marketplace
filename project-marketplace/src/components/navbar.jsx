import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaCog, FaWallet, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { toast } from "react-toastify";

function Navbar() {
  const [account, setAccount] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
        } else {
          setAccount(null);
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const handleWalletConnect = async () => {
    setLoading(true);

    try {
      if (!window.ethereum) {
        toast.error("Please install a wallet!");
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toast.success("Wallet connected successfully!");
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error(error.message || "Error connecting wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAccount(null);
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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isSticky ? "py-2 backdrop-blur-md bg-gray-900/95" : "py-4 bg-transparent"
    }`}>
      <div className="container flex justify-between items-center px-6 mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          NFT<span className="text-blue-500">Market</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link to="/marketplace" className="text-gray-300 transition-colors hover:text-white">
            Marketplace
          </Link>
          <Link to="/mint" className="text-gray-300 transition-colors hover:text-white">
            Create
          </Link>
        </div>

        {/* Wallet Connection */}
        <div className="relative">
          {account ? (
            <div className="relative profile-menu">
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle className="text-xl" />
                <span className="hidden md:inline">
                  {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </span>
              </motion.button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 py-2 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl"
                >
                  <Link
                    to="/settings"
                    className="flex gap-2 items-center px-4 py-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                  >
                    <FaCog className="text-lg" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex gap-2 items-center px-4 py-2 w-full text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span>Disconnect</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              onClick={handleWalletConnect}
              className="flex gap-2 items-center px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <FaWallet className="text-lg" />
              {loading ? "Connecting..." : "Connect Wallet"}
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;