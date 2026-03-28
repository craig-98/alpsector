'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Market {
  name: string
  price: number
  change: number
  positive: boolean
  labels?: string[]
  data?: number[]
}

interface AssetSliderProps {
  markets: Market[]
}

const mockMarkets: Market[] = [
  { name: 'Ethereum', price: 2580.75, change: 0.95, positive: true },
  { name: 'Bitcoin', price: 62345.67, change: 1.23, positive: true },
  { name: 'Tesla', price: 433.27, change: 3.45, positive: true },
  { name: 'Apple', price: 254.41, change: -0.56, positive: false },
]

// Map display names to TradingView symbols
const symbolMap: Record<string, string> = {
  'Ethereum': 'BINANCE:ETHUSDT',
  'ETH': 'BINANCE:ETHUSDT',
  'Bitcoin': 'BINANCE:BTCUSDT',
  'BTC': 'BINANCE:BTCUSDT',
  'Tesla': 'NASDAQ:TSLA',
  'TSLA': 'NASDAQ:TSLA',
  'Apple': 'NASDAQ:AAPL',
  'AAPL': 'NASDAQ:AAPL',
  'SPY': 'AMEX:SPY',
  'NASDAQ': 'NASDAQ:QQQ',
  'QQQ': 'NASDAQ:QQQ',
  'GOOGL': 'NASDAQ:GOOGL',
  'MSFT': 'NASDAQ:MSFT',
  'AMZN': 'NASDAQ:AMZN',
}

function TradingViewMiniChart({ symbol, positive }: { symbol: string; positive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // Clear previous widget
    containerRef.current.innerHTML = ''
    
    const tvSymbol = symbolMap[symbol] || `NASDAQ:${symbol}`
    
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: tvSymbol,
      width: '100%',
      height: '100%',
      locale: 'en',
      dateRange: '1D',
      colorTheme: 'dark',
      isTransparent: true,
      autosize: true,
      largeChartUrl: '',
      noTimeScale: false,
      chartOnly: false,
      trendLineColor: positive ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)',
      underLineColor: positive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      underLineBottomColor: 'rgba(0, 0, 0, 0)',
    })
    
    containerRef.current.appendChild(script)
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol, positive])
  
  return (
    <div 
      ref={containerRef} 
      className="tradingview-widget-container w-full h-full [&>div]:!bg-transparent"
    />
  )
}

export default function AssetSlider({ markets }: AssetSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liveMarkets, setLiveMarkets] = useState(markets?.length > 0 ? markets : mockMarkets)

  useEffect(() => {
    if (markets?.length > 0) {
      setLiveMarkets(markets)
    }
  }, [markets])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveMarkets.length)
    }, 8000) // 8s to let the TradingView widget load

    return () => clearInterval(interval)
  }, [liveMarkets.length])

  const currentAsset = liveMarkets[currentIndex]

  return (
    <div className="relative max-w-sm mx-auto lg:mx-0 w-full lg:ml-auto group">
      {/* Background glow shadow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
      
      <div className="relative glass-panel rounded-[2.5rem] p-8 sm:p-10 overflow-hidden h-full transform transition duration-500 hover:scale-[1.02] border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -ml-10 -mb-10" />
        
        <AnimatePresence mode='wait'>
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-2xl flex items-center justify-center mr-4 ring-1 ring-white/20 shadow-xl">
                  <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-xl text-white tracking-tight">{currentAsset?.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[10px] text-brand-muted uppercase font-black tracking-[0.2em]">Live Market</p>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-inner">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-tighter">Hot</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-4 relative z-10">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-2xl">
                  ${currentAsset?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className={`text-sm font-black flex items-center gap-1.5 ${currentAsset?.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                <div className={`p-1 rounded-lg ${currentAsset?.positive ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {currentAsset?.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                </div>
                {Math.abs(currentAsset?.change || 0).toFixed(2)}%
                <span className="text-[10px] text-brand-muted font-bold ml-1">24h</span>
              </div>
            </div>

            {/* TradingView Chart */}
            <div className="h-[180px] sm:h-[200px] mb-6 relative z-10 -mx-2 rounded-2xl overflow-hidden">
              <TradingViewMiniChart 
                symbol={currentAsset?.name} 
                positive={currentAsset?.positive ?? true} 
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {liveMarkets.map((m, i) => (
                    <div 
                      key={i} 
                      className={`w-7 h-7 rounded-full border-2 border-brand-surface flex items-center justify-center overflow-hidden text-[8px] font-black cursor-pointer transition-all ${
                        i === currentIndex ? 'bg-emerald-500 text-white scale-110 z-10' : 'bg-white/10 text-brand-muted hover:bg-white/20'
                      }`}
                      onClick={() => setCurrentIndex(i)}
                    >
                      {m.name.slice(0, 2)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">
                  Powered by TradingView
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
