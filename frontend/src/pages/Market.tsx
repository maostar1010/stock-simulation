"use client";

import { useState, useEffect, useRef } from "react";
import StockChart from '../components/StockChart';
import { useAuth } from "@/components/signup/AuthContext";

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  symbol: string;
  currentPrice: number;
}

const BuyModal: React.FC<BuyModalProps> = ({ isOpen, onClose, onConfirm, symbol, currentPrice }) => {
  const [quantity, setQuantity] = useState(1);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 max-w-[90%]">
        <h2 className="text-2xl font-bold mb-4">Buy {symbol}</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Price:</span>
            <span className="font-semibold text-black !important">${currentPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="quantity" className="text-gray-600">Quantity:</label>
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
            <span className="text-gray-600">Total Cost:</span>
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

const timeframes = ['1D', '1W', '1M', '3M', '1Y'] as const;

interface TickerResult {
  symbol: string;
  name: string;
}

interface APIResponse {
  count: number;
  results?: TickerResult[];
  error?: string;
}

export default function Market() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSymbol, setCurrentSymbol] = useState('AAPL');
  const [selectedTimeframe, setSelectedTimeframe] = useState<typeof timeframes[number]>('1D');
  const [suggestions, setSuggestions] = useState<TickerResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      if (!currentSymbol) return;

      try {
        const response = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${currentSymbol}/prev?apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`
        );
        
        const data = await response.json();
        
        if (data.results && data.results[0]) {
          setCurrentPrice(data.results[0].c); // 'c' is the closing price
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };

    fetchCurrentPrice();

    // Optional: Set up polling to update price every minute
    const interval = setInterval(fetchCurrentPrice, 60000);
    
    return () => clearInterval(interval);
  }, [currentSymbol]);

  // useEffect(() => {
  //   const fetchSuggestions = async () => {
  //     if (searchQuery.length < 1) {
  //       setSuggestions([]);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`https://ticker-2e1ica8b9.now.sh/keyword/${searchQuery}`);
  //       const data: APIResponse = await response.json();
        
  //       if (data.error) {
  //         console.error('API Error:', data.error);
  //         setSuggestions([]);
  //         return;
  //       }

  //       setSuggestions(data.results || []);
  //     } catch (error) {
  //       console.error('Error fetching suggestions:', error);
  //       setSuggestions([]);
  //     }
  //   };

  //   const debounceTimer = setTimeout(fetchSuggestions, 300);
  //   return () => clearTimeout(debounceTimer);
  // }, [searchQuery]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
  //       setShowSuggestions(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentSymbol(searchQuery.toUpperCase());
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    setCurrentSymbol(symbol);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleBuy = async (quantity: number) => {
    if (!currentSymbol || !currentPrice) {
      setError("Stock symbol or price not available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Using token: ',token);
      const response = await fetch('http://localhost:8000/api/portfolios/buy/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          ticker: currentSymbol,
          price: currentPrice,
          shares: quantity
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to buy stock');
      }

      alert(`Successfully bought ${quantity} shares of ${currentSymbol} at $${currentPrice}`);
      
      if (data.updated_balance) {
        // Update balance in your app state if you're tracking it
        // setUserBalance(data.updated_balance);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to buy stock';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
      setIsBuyModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-8 relative md:pl-16">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-grow relative" ref={searchContainerRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-black"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {suggestions.map((result) => (
                  <button
                    key={result.symbol}
                    onClick={() => handleSuggestionClick(result.symbol)}
                    className="w-full btn-primary px-4 py-2 text-left hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span className="font-medium">{result.symbol}</span>
                    <span className="text-gray-600 text-sm truncate ml-4">{result.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-6 py-2 rounded-full transition-all font-medium ${
                selectedTimeframe === timeframe
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {currentPrice && (
            <span className="text-lg font-semibold text-black">
              ${currentPrice.toFixed(2)}
            </span>
          )}
          <button
            onClick={() => setIsBuyModalOpen(true)}
            disabled={isLoading || !currentPrice}
            className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50"
          >
            Buy
          </button>
        </div>
      </div>

      <div className="bg-accent/5 rounded-3xl p-6 shadow-lg">
        <StockChart 
          symbol={currentSymbol} 
          timeframe={selectedTimeframe}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Popular Stocks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM'].map((symbol) => (
            <button
              key={symbol}
              onClick={() => setCurrentSymbol(symbol)}
              className={`btn-primary p-4 rounded-xl shadow transition-all hover:shadow-md ${
                currentSymbol === symbol 
                  ? 'bg-accent text-white' 
                  : 'bg-accent-secondary hover:bg-accent'
              }`}
            >
              <span className="font-semibold">{symbol}</span>
            </button>
          ))}
        </div>
      </div>

      <BuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onConfirm={handleBuy}
        symbol={currentSymbol || ''}
        currentPrice={currentPrice || 0}
      />
      
      {error && (
        <div className="mt-2 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
