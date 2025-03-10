import { useEffect, useState } from "react";
import axios from "axios";

interface StockData {
  ticker: string;
  price: number;
  change_amount: number;
  change_percentage: number;
  volume: number;
}

export default function Footer() {
  // const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
  const [stocks, setStocks] = useState<StockData[]>([]);
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // const response = await axios.get(
        //   `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${POLYGON_API_KEY}`
        // );
        const response = await axios.get(
          `http://127.0.0.1:8000/api/stock/top-gainers/`
        );
        const gainers = response.data || [];

        setStocks(gainers.slice(0, 10));
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, []);

  return (
    <footer className="w-screen bg-black text-white p-4 h-12 relative overflow-hidden">
      <div className="whitespace-nowrap overflow-hidden">
        <div className="inline-block animate-marquee">
          {[...stocks, ...stocks].map((stock, index) => (
            <span key={index} className="inline-block mx-6">
              {stock.ticker} - ${stock.price}
              <span className={"text-green-400"}>
                ({stock.change_percentage}%)
              </span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
