import React, { useState } from 'react';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  symbol: string;
  currentPrice: number;
}

const BuyModal: React.FC<BuyModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  symbol, 
  currentPrice 
}) => {
  const [quantity, setQuantity] = useState(1);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 max-w-[90%] text-black">
        <h2 className="text-2xl font-bold mb-4 text-black">Buy {symbol}</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-black">Current Price:</span>
            <span className="font-semibold text-black !important">${currentPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col space-y-2 text-black">
            <label htmlFor="quantity" className="text-black">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-black"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-black">Total Cost:</span>
            <span className="font-semibold text-black !important">${(quantity * currentPrice).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-black !important"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(quantity);
              onClose();
            }}
            className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Confirm Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal; 