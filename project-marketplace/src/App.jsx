import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/LandingPage';
import MintNFT from './pages/MintNFT';
import Marketplace from './pages/Marketplace';
import NFTDetail from './pages/NFTDetail';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mint" element={<MintNFT />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Routes>
        <ToastContainer position="bottom-right" theme="dark" />
      </div>
    </Router>
  );
}

export default App;