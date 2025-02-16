import React, { useEffect, useMemo, useState } from 'react'
import fetchStockData from './services'
import { formatStockData } from './utils'
import ReactApexChart from 'react-apexcharts'
import { candleStickOptions } from './constants'

interface LiveChartProps {
    symbol: string
}

interface StockData {
    "Weekly Adjusted Time Series": {
        [key: string]: {
            "1. open": string
            "2. high": string
            "3. low": string
            "4. close": string
        }
    }
}

// Add this line to fix the typing issue
const Chart = ReactApexChart as typeof ReactApexChart & { new (): any }

const LiveChart: React.FC<LiveChartProps> = ({ symbol }) => {
    const [stockData, setStockData] = useState<StockData | {}>({})

    useEffect(() => {
        fetchStockData(symbol).then((data: StockData) =>
            setStockData(data)
        )
    }, [symbol])

    const seriesData = useMemo(() => formatStockData(stockData as StockData), [stockData])

    return (
        <Chart
            options={candleStickOptions}
            series={[{ data: seriesData }]}
            type="candlestick"
            height={350}
        />
    )
}

export default LiveChart