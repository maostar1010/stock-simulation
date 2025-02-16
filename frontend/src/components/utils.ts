interface StockDataPoint {
  x: string;
  y: [string, string, string, string];
}

interface RawStockData {
  "Weekly Adjusted Time Series": {
    [key: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
    }
  }
}

export const formatStockData = (stockData: RawStockData): StockDataPoint[] => {
  const formattedData: StockDataPoint[] = [];

  if (stockData["Weekly Adjusted Time Series"]) {
    Object.entries(stockData["Weekly Adjusted Time Series"]).forEach(
      ([key, value]) => {
        formattedData.push({
          x: key,
          y: [
            value["1. open"],
            value["2. high"],
            value["3. low"],
            value["4. close"],
          ],
        });
      }
    );
  }
  return formattedData;
}; 