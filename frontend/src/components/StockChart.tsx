import { useEffect, useState, useCallback, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StockData {
  date: string;
  price: number;
  volume: number;
  high: number;
  low: number;
}

interface CacheEntry {
  data: StockData[];
  timestamp: number;
  timeframe: string;
}

interface CacheMap {
  [key: string]: CacheEntry;
}

interface StockChartProps {
  symbol: string;
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
}

export default function StockChart({ symbol, timeframe }: StockChartProps) {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  const cacheRef = useRef<CacheMap>({});

  const fetchStockData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsRateLimited(false);

    const cacheKey = `${symbol}-${timeframe}`;
    const cachedData = cacheRef.current[cacheKey];
    const CACHE_DURATION = 600 * 1000; // 60 seconds

    if (cachedData && 
        Date.now() - cachedData.timestamp < CACHE_DURATION && 
        cachedData.timeframe === timeframe) {
      setStockData(cachedData.data);
      setIsLoading(false);
      return;
    }
    
    try {
      const end = new Date();
      let start = new Date();
      let multiplier = 1;
      let timespan = 'day';

      if (timeframe === '1D') {
        start.setDate(start.getDate() - 1);
        timespan = 'minute';
        multiplier = 5; // Fetch data every 5 minutes
      } else {
        switch (timeframe) {
          case '1W':
            start.setDate(start.getDate() - 7);
            timespan = 'hour';
            break;
          case '1M':
            start.setMonth(start.getMonth() - 1);
            break;
          case '3M':
            start.setMonth(start.getMonth() - 3);
            break;
          case '1Y':
            start.setFullYear(start.getFullYear() - 1);
            break;
        }
      }

      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];

      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${startDate}/${endDate}?apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`;
      
      console.log('Fetching from:', url.replace(import.meta.env.VITE_POLYGON_API_KEY, 'API_KEY'));
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.status === 429) {
        setIsRateLimited(true);
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stock data');
      }

      if (data.resultsCount === 0) {
        throw new Error('No data available for this symbol and timeframe');
      }

      const formattedData = data.results.map((result: any) => ({
        date: new Date(result.t).toLocaleString(),
        price: result.c, // closing price
        volume: result.v,
        high: result.h,
        low: result.l
      }));

      // Store in cache
      cacheRef.current[cacheKey] = {
        data: formattedData,
        timestamp: Date.now(),
        timeframe
      };

      setStockData(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      console.error('Error details:', err);
    } finally {
      setIsLoading(false);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  const chartData = {
    labels: stockData.map(data => data.date),
    datasets: [
      {
        label: `${symbol} Price`,
        data: stockData.map(data => data.price),
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: stockData.length > 100 ? 0 : 2,
        pointHoverRadius: 4,
        borderWidth: 2,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          }
        }
      },
      title: {
        display: true,
        text: `${symbol} Stock Price (${timeframe})`,
        font: {
          size: 16,
          weight: 'bold' as const,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: any) => {
            return `Price: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          maxRotation: 0,
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`,
        }
      }
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-white rounded-xl">
        <div className="animate-pulse text-accent">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center h-[400px] flex items-center justify-center bg-white rounded-xl p-4">
        <div>
          <p className="font-semibold mb-2">{error}</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  if (isRateLimited) {
    return (
      <div className="text-orange-500 text-center h-[400px] flex items-center justify-center bg-white rounded-xl p-4">
        <div>
          <p className="font-semibold mb-2">Rate limit exceeded</p>
          <p className="text-sm text-gray-500">Please wait a moment before making another request</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
      <Line data={chartData} options={options} />
    </div>
  );
} 