import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEye, 
  FaBookmark, 
  FaHandshake, 
  FaPalette,
  FaCog, 
  FaMoon, 
  FaGraduationCap, 
  FaQuestionCircle, 
  FaHeadset,
  FaGlobe,
  FaChevronRight,
  FaArrowLeft,
  FaHome
} from 'react-icons/fa';

function ProfileSettings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');

  const menuItems = [
    { id: 'profile', icon: <FaUser />, label: 'Profile' },
    { id: 'visibility', icon: <FaEye />, label: 'Visibility' },
    { id: 'watchlist', icon: <FaBookmark />, label: 'Watchlist' },
    { id: 'deals', icon: <FaHandshake />, label: 'Deals' },
    { id: 'studio', icon: <FaPalette />, label: 'Studio' },
    { id: 'settings', icon: <FaCog />, label: 'Settings' },
  ];

  const bottomMenuItems = [
    { id: 'language', icon: <FaGlobe />, label: 'Language' },
    { id: 'darkMode', icon: <FaMoon />, label: 'Night Mode' },
    { id: 'learn', icon: <FaGraduationCap />, label: 'Learn' },
    { id: 'help', icon: <FaQuestionCircle />, label: 'Help center' },
    { id: 'support', icon: <FaHeadset />, label: 'Support' },
  ];

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 to-black">
      {/* Navigation Buttons */}
      <div className="flex fixed top-6 left-6 z-50 gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex gap-2 items-center px-6 py-2 font-medium text-blue-200 rounded-lg border backdrop-blur-sm transition-colors bg-blue-900/30 border-blue-400/20 hover:bg-blue-800/40"
        >
          <FaArrowLeft />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex gap-2 items-center px-6 py-2 font-medium text-blue-200 rounded-lg border backdrop-blur-sm transition-colors bg-blue-900/30 border-blue-400/20 hover:bg-blue-800/40"
        >
          <FaHome />
          Home
        </motion.button>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-4 w-64 rounded-xl border border-gray-700 backdrop-blur-sm bg-gray-800/50"
          >
            {/* Main Menu */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-700" />

            {/* Bottom Menu */}
            <div className="space-y-2">
              {bottomMenuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (item.id === 'darkMode') {
                      setIsDarkMode(!isDarkMode);
                    }
                    setActiveSection(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'language' && (
                    <div className="flex items-center text-sm">
                      <span className="mr-2">{language.toUpperCase()}</span>
                      <FaChevronRight className="text-xs" />
                    </div>
                  )}
                  {item.id === 'darkMode' && (
                    <div className="relative">
                      <motion.div
                        initial={false}
                        animate={{ backgroundColor: isDarkMode ? '#3B82F6' : '#1F2937' }}
                        className="p-1 w-10 h-6 rounded-full cursor-pointer"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                      >
                        <motion.div
                          initial={false}
                          animate={{ x: isDarkMode ? 16 : 0 }}
                          className="w-4 h-4 bg-white rounded-full"
                        />
                      </motion.div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 p-8 rounded-xl border border-gray-700 backdrop-blur-sm bg-gray-800/50"
          >
            <motion.h2 
              key={activeSection}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 text-2xl font-bold"
            >
              {menuItems.find(item => item.id === activeSection)?.label || 
               bottomMenuItems.find(item => item.id === activeSection)?.label}
            </motion.h2>

            {/* Content will change based on activeSection */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div className="flex gap-6 items-center">
                    <div className="relative">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        alt="Profile"
                        className="w-24 h-24 rounded-full"
                      />
                      <button className="absolute right-0 bottom-0 p-2 bg-blue-600 rounded-full transition-colors hover:bg-blue-700">
                        <FaUser className="text-sm" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">John Doe</h3>
                      <p className="text-gray-400">john.doe@example.com</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-400">Display Name</label>
                      <input
                        type="text"
                        className="px-4 py-2 w-full rounded-lg border border-gray-600 bg-gray-700/50 focus:outline-none focus:border-blue-500"
                        defaultValue="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-400">Bio</label>
                      <textarea
                        className="px-4 py-2 w-full rounded-lg border border-gray-600 bg-gray-700/50 focus:outline-none focus:border-blue-500"
                        rows="4"
                        defaultValue="NFT enthusiast and digital art collector"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Add other section content here */}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings; 