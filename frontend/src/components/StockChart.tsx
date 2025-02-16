import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockData {
  date: string;
  price: number;
}

interface StockChartProps {
  symbol: string;
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y';
}

export default function StockChart({ symbol, timeframe }: StockChartProps) {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Calculate date range
        const end = new Date();
        let start = new Date();
        let multiplier = 1;
        let timespan = 'day';

        switch (timeframe) {
          case '1D':
            start.setDate(start.getDate() - 1);
            timespan = 'minute';
            multiplier = 5;
            break;
          case '1W':
            start.setDate(start.getDate() - 7);
            timespan = 'hour';
            multiplier = 1;
            break;
          case '1M':
            start.setMonth(start.getMonth() - 1);
            timespan = 'day';
            multiplier = 1;
            break;
          case '3M':
            start.setMonth(start.getMonth() - 3);
            timespan = 'day';
            multiplier = 1;
            break;
          case '1Y':
            start.setFullYear(start.getFullYear() - 1);
            timespan = 'day';
            multiplier = 1;
            break;
        }

        const startDate = start.toISOString().split('T')[0];
        const endDate = end.toISOString().split('T')[0];

        const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${startDate}/${endDate}?apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`;
        
        console.log('Fetching from:', url.replace(import.meta.env.VITE_POLYGON_API_KEY, 'API_KEY'));
        
        const response = await fetch(url);
        const data = await response.json();
        console.log('Data:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stock data');
        }

        if (data.resultsCount === 0) {
          throw new Error('No data available for this symbol and timeframe');
        }

        const formattedData = data.results.map((result: any) => ({
          date: new Date(result.t).toLocaleString(),
          price: result.c // closing price
        }));

        setStockData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
        console.error('Error details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, timeframe]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-xl">
        <div className="text-accent">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center h-64 flex items-center justify-center bg-white rounded-xl p-4">
        <div>
          <p className="font-semibold mb-2">{error}</p>
        </div>
      </div>
    );
  }

  if (stockData.length === 0) {
    return (
      <div className="text-accent text-center h-64 flex items-center justify-center bg-white rounded-xl">
        No data available for this timeframe
      </div>
    );
  }

  const chartData = {
    labels: stockData.map(data => data.date),
    datasets: [
      {
        label: symbol,
        data: stockData.map(data => data.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${symbol} Stock Price (${timeframe})`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <Line data={chartData} options={options} />
    </div>
  );
} 