import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NFTGrid from '../components/NFTGrid';
import { FaSearch, FaFilter, FaCube, FaPaintBrush, FaGamepad, FaMusic, FaImage } from 'react-icons/fa';

function Marketplace() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = [
    { id: 'all', name: 'All NFTs', icon: FaCube, color: 'from-purple-500 to-indigo-500' },
    { id: 'art', name: 'Digital Art', icon: FaPaintBrush, color: 'from-pink-500 to-rose-500' },
    { id: 'gaming', name: 'Gaming', icon: FaGamepad, color: 'from-green-500 to-emerald-500' },
    { id: 'music', name: 'Music', icon: FaMusic, color: 'from-blue-500 to-cyan-500' },
    { id: 'collectibles', name: 'Collectibles', icon: FaImage, color: 'from-yellow-500 to-orange-500' },
  ];

  // Animated background patterns
  const backgroundPatterns = [...Array(20)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute opacity-10"
      animate={{
        x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
        y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
        rotate: [0, 360],
      }}
      transition={{
        duration: Math.random() * 20 + 10,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    />
  ));

  return (
    <div className="overflow-hidden relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background Patterns */}
      {backgroundPatterns}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-xl bg-gray-900/70">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
            >
              NFT Marketplace
            </motion.button>
            <div className="flex gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/mint')}
                className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg transition-all duration-300 hover:shadow-purple-500/25"
              >
                Mint NFT
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-4 py-20">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 md:text-6xl"
          >
            Discover Rare Digital Art
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-xl text-gray-300"
          >
            Explore the world&apos;s best NFT marketplace
          </motion.p>

          {/* Search Bar */}
          <div className="mx-auto mb-16 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search NFTs..."
                className="px-6 py-4 w-full placeholder-gray-400 text-white rounded-full border border-gray-700 transition-all duration-300 bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FaSearch className="absolute right-6 top-1/2 text-gray-400 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white`
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <category.icon className="text-lg" />
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <NFTGrid searchTerm={searchTerm} category={selectedCategory} priceRange={priceRange} />

      {/* Filter Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="fixed right-6 bottom-6 z-50 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-purple-500/25"
      >
        <FaFilter className="text-xl text-white" />
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="overflow-y-auto fixed top-0 right-0 bottom-0 z-40 p-6 w-80 border-l border-gray-800 backdrop-blur-xl bg-gray-900/90"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  ✕
                </motion.button>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  Price Range
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <span className="text-white">{priceRange[0]} ETH</span>
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <span className="text-white">{priceRange[1]} ETH</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Marketplace; 