import { useEffect, useState } from "react";
import axios from "axios";

interface StockData {
  ticker: string;
  price: number;
  change_amount: number;
  change_percentage: number;
  volumn: number;
}

export default function Footer() {
  // const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
  const ALPHA_VANTAGE_KEY = "YOXRXLBUPR0JJ8R0";
  const [stocks, setStocks] = useState<StockData[]>([]);
  useEffect(() => {
    console.log("ALPHA_VANTAGE_KEY", ALPHA_VANTAGE_KEY);
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_KEY}`
        );
        const gainers = response.data?.top_gainers || [];
        console.log("RESPONSE", response.data);

        setStocks(gainers.slice(0, 10));
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, []);

  return (
    <footer className="w-screen bg-black text-white p-4 overflow-hidden">
      <div className="whitespace-nowrap overflow-hidden">
        <div className="inline-block animate-marquee">
          {[...stocks, ...stocks].map((stock, index) => (
            <span key={index} className="inline-block mx-6">
              {stock.ticker} - ${stock.price}
              <span className={"text-green-400"}>
                ({stock.change_percentage})
              </span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
