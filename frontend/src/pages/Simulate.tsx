"use client"

import { useState } from "react"

export default function Simulate() {
  const [balance, setBalance] = useState(10000)
  const [stocks, setStocks] = useState([
    { id: 1, name: "TechCo", price: 150, owned: 0 },
    { id: 2, name: "EcoEnergy", price: 75, owned: 0 },
    { id: 3, name: "HealthCare", price: 200, owned: 0 },
  ])

  const buyStock = (id: number) => {
    setStocks(stocks.map((stock) => (stock.id === id ? { ...stock, owned: stock.owned + 1 } : stock)))
    setBalance(balance - stocks.find((s) => s.id === id)!.price)
  }

  const sellStock = (id: number) => {
    const stock = stocks.find((s) => s.id === id)!
    if (stock.owned > 0) {
      setStocks(stocks.map((s) => (s.id === id ? { ...s, owned: s.owned - 1 } : s)))
      setBalance(balance + stock.price)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-center">Stock Market Simulation</h1>
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Your Balance: ${balance.toFixed(2)}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <div key={stock.id} className="card">
            <h3>{stock.name}</h3>
            <p className="text-lg font-semibold mb-2">Price: ${stock.price}</p>
            <p className="mb-4">Owned: {stock.owned}</p>
            <div className="flex justify-between">
              <button onClick={() => buyStock(stock.id)} className="btn btn-primary" disabled={balance < stock.price}>
                Buy
              </button>
              <button onClick={() => sellStock(stock.id)} className="btn btn-primary" disabled={stock.owned === 0}>
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

