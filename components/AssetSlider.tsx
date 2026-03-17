'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface Market {
  name: string
  price: number
  change: number
  positive: boolean
  labels: string[]
  data: number[]
}

interface AssetSliderProps {
  markets: Market[]
}

const mockMarkets: Market[] = [
  { name: 'Ethereum', price: 2580.75, change: 0.95, positive: true, labels: ['1m', '5m', '15m'], data: [2500, 2550, 2580] },
  { name: 'Bitcoin', price: 62345.67, change: 1.23, positive: true, labels: ['1m', '5m', '15m'], data: [61000, 61800, 62345] },
  { name: 'Tesla', price: 433.27, change: 3.45, positive: true, labels: ['1m', '5m', '15m'], data: [420, 428, 433] },
  { name: 'Apple', price: 254.41, change: -0.56, positive: false, labels: ['1m', '5m', '15m'], data: [256, 255, 254] },
]

export default function AssetSlider({ markets }: AssetSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liveMarkets, setLiveMarkets] = useState(markets || mockMarkets)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveMarkets.length)
      
      // Mock live price update
      setLiveMarkets((prev) =>
        prev.map((market, i) => ({
          ...market,
          price: market.price + (Math.random() - 0.5) * 10,
          change: (Math.random() - 0.5) * 2,
          positive: Math.random() > 0.5,
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [liveMarkets.length])

  const currentAsset = liveMarkets[currentIndex]

  const chartData = {
    labels: currentAsset?.labels,
    datasets: [
      {
        data: currentAsset?.data,
        borderColor: currentAsset?.positive ? '#10b981' : '#ef4444',
        backgroundColor: currentAsset?.positive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  }

  return (
    <motion.div 
      key={currentIndex}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="lg:ml-auto"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 max-w-sm mx-auto lg:mx-0">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{currentAsset?.name}</h3>
            <p className="text-sm text-slate-500">Live Price</p>
          </div>
        </div>
        <div className="text-center mb-8">
          <motion.div 
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-5xl font-black text-slate-900 mb-2"
          >
            ${currentAsset?.price?.toLocaleString()}
          </motion.div>
          <div className={`text-2xl font-bold flex items-center justify-center ${currentAsset?.positive ? 'text-emerald-600' : 'text-red-600'}`}>
            {currentAsset?.positive ? '↑' : '↓'} {currentAsset?.change?.toFixed(2)}%
          </div>
        </div>
        <div className="h-24 mb-4">
          <Line data={chartData} options={options} />
        </div>
        <div className="flex items-center justify-center text-xs text-slate-500 space-x-1">
          Updated: 
          <div className="flex space-x-0.5">
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-xs text-slate-500 mb-2">Next: {liveMarkets[(currentIndex + 1) % liveMarkets.length]?.name}</div>
          <div className="text-sm font-medium text-slate-700">Auto-slide every 5s</div>
        </div>
      </div>
    </motion.div>
  )
}

