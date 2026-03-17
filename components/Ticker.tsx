'use client'

import { useEffect, useState } from 'react'

interface Market {
  name: string
  price: number
  change: number
  positive: boolean
}

export default function Ticker({ markets }: { markets: Market[] }) {
  const [scroll, setScroll] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScroll((prev) => (prev + 1) % 200)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 overflow-hidden whitespace-nowrap">
      <div 
        className="inline-flex gap-8 animate-marquee"
        style={{ '--marquee-speed': '20s' } as React.CSSProperties}
      >
        {[...markets, ...markets].map((market, index) => (
          <span key={index} className="flex items-center gap-4">
            <span className="font-mono font-semibold">{market.name}</span>
            <span className="font-mono">${market.price.toLocaleString()}</span>
            <span className={`font-mono font-semibold ${market.positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {market.positive ? '↑' : '↓'} {market.change}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

