import { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

const WalletOptions = ({ onSelect }) => {
  // Array of wallet options to display
  const wallets = useMemo(() => [
    {
      id: "metamask",
      name: "MetaMask",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      detector: () => window.ethereum && window.ethereum.isMetaMask,
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      image: "https://www.coinbase.com/favicon.ico",
      detector: () => window.ethereum && window.ethereum.isCoinbaseWallet,
    },
    {
      id: "okx",
      name: "OKX Wallet",
      image: "https://www.okx.com/favicon.ico",
      detector: () =>
        window.okxwallet || (window.ethereum && window.ethereum.isOkxWallet),
    },
    {
      id: "bitget",
      name: "Bitget Wallet",
      image: "https://www.bitget.com/favicon.ico",
      detector: () => window.ethereum && window.ethereum.isBitget,
    },
  ], []);

  // Optimized handler using useCallback
  const handleSelect = useCallback(
    (walletId) => {
      const wallet = wallets.find((w) => w.id === walletId);
      if (!wallet) {
        alert("Wallet not found!");
        return;
      }

      // Check if the wallet is detected
      if (!wallet.detector()) {
        alert(`${wallet.name} is not installed or not detected.`);
        return;
      }

      // Pass the wallet ID to the parent component
      onSelect(walletId);
    },
    [onSelect, wallets]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container */}
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-white">Choose a Wallet</h2>
        <div className="grid grid-cols-2 gap-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleSelect(wallet.id)}
              className="flex flex-col items-center p-4 transition duration-300 bg-gray-700 rounded hover:bg-gray-600"
            >
              <img
                src={wallet.image}
                alt={wallet.name}
                className="object-contain w-12 h-12 mb-2"
              />
              <span className="font-medium text-center text-white">
                {wallet.name}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => onSelect(null)}
          className="w-full py-2 mt-4 text-white transition duration-300 bg-red-500 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

WalletOptions.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default WalletOptions;
