'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
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
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    animation: { duration: 0 }
  }

  return (
    <div className="relative max-w-sm mx-auto lg:mx-0 w-full lg:ml-auto group">
      {/* Background glow shadow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
      
      <div className="relative glass-panel rounded-3xl p-8 overflow-hidden h-full transform transition duration-500 hover:scale-[1.02]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
        
        <AnimatePresence mode='wait'>
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-8 relative z-10">
              <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center mr-4 ring-1 ring-white/10 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20" />
                <svg className="w-6 h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white tracking-wide">{currentAsset?.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-brand-muted uppercase tracking-widest">Live Chart</p>
                  <span className="relative flex h-1.5 w-1.5 mt-[1px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mb-8 relative z-10">
              <motion.div 
                className="text-5xl font-black text-white mb-2 drop-shadow-md tracking-tighter"
              >
                ${currentAsset?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
              <div className={`text-xl font-bold flex items-center justify-center ${currentAsset?.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {currentAsset?.positive ? '↑' : '↓'} {Math.abs(currentAsset?.change || 0).toFixed(2)}%
              </div>
            </div>

            <div className="h-28 mb-6 relative z-10">
              <Line data={chartData} options={options as any} />
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-brand-muted pt-4 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">Next:</span>
                <span className="text-white">{liveMarkets[(currentIndex + 1) % liveMarkets.length]?.name}</span>
              </div>
              <div className="bg-white/5 px-2 py-1 rounded-md border border-white/5">Auto-slide</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
