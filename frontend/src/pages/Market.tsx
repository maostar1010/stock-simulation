"use client";

import { useState, useEffect, useRef } from "react";
import StockChart from '../components/StockChart';

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
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`https://ticker-2e1ica8b9.now.sh/keyword/${searchQuery}`);
        const data: APIResponse = await response.json();
        
        if (data.error) {
          console.error('API Error:', data.error);
          setSuggestions([]);
          return;
        }

        setSuggestions(data.results || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-8 relative">
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
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-black"
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
            className="btn-primary px-8 py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
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
    </div>
  );
}
