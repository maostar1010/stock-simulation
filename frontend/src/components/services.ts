const VITE_API_KEY = import.meta.env.ALPHA_VANTAGE_KEY

interface StockData {
  'Weekly Adjusted Time Series': {
    [key: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
    }
  }
} 

export default async function fetchStockData(symbol: string): Promise<StockData> {
  const response = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${VITE_API_KEY}`
  );
  const data = await response.json();
  return data;
}