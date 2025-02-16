"use client";

import { useState } from "react";
import StockChart from '../components/StockChart';

const timeframes = ['1D', '1W', '1M', '3M', '1Y'] as const;

export default function Market() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSymbol, setCurrentSymbol] = useState('AAPL');
  const [selectedTimeframe, setSelectedTimeframe] = useState<typeof timeframes[number]>('1D');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentSymbol(searchQuery.toUpperCase());
      setSearchQuery('');
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-accent text-black"
          />
          <button
            type="submit"
            className="bg-accent text-white px-8 py-2 rounded-lg hover:bg-accent-foreground transition-colors rounded-xl"
          >
            Search
          </button>
        </form>
      </div>

      {/* Timeframe Selector */}
      <div className="mb-6 flex gap-2">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`btn-primary px-4 py-2 rounded-3xl transition-colors ${
              selectedTimeframe === timeframe
                ? 'bg-accent text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Stock Chart */}
      <div className="bg-accent-foreground rounded-3xl p-8">
        <StockChart 
          symbol={currentSymbol} 
          timeframe={selectedTimeframe}
        />
      </div>

      {/* Popular Stocks */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Popular Stocks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['AAPL', 'GOOGL', 'MSFT', 'AMZN'].map((symbol) => (
            <button
              key={symbol}
              onClick={() => setCurrentSymbol(symbol)}
              className="btn-primary p-4 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <span className="font-semibold">{symbol}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
