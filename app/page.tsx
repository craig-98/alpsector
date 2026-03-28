'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Ticker from '@/components/Ticker'
import AssetSlider from '@/components/AssetSlider'
import AssetClasses from '@/components/AssetClasses'
import SecurityTrust from '@/components/SecurityTrust'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import { assets } from '@/lib/api'
import { initSocket } from '@/lib/socket'

export default function Home() {
  const [time, setTime] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [markets, setMarkets] = useState<any[]>([])

  const fetchMarkets = async () => {
    try {
      const [stocks, etfs] = await Promise.all([
        assets.getStocks(),
        assets.getEtfs()
      ]);
      
      const formattedStocks = (stocks || []).slice(0, 3).map((s: any) => ({
        name: s.symbol,
        price: s.price,
        change: s.change_percentage,
        positive: s.change_percentage >= 0
      }));
      
      const formattedEtfs = (etfs || []).slice(0, 3).map((e: any) => ({
        name: e.symbol,
        price: e.price || 0,
        change: e.performance_ytd || 0,
        positive: (e.performance_ytd || 0) >= 0
      }));

      setMarkets([...formattedStocks, ...formattedEtfs]);
    } catch (err) {
      console.error('Failed to fetch markets:', err);
      setMarkets([
        { name: 'BTC', price: 64289.45, change: 2.12, positive: true },
        { name: 'ETH', price: 3478.22, change: -1.23, positive: false },
        { name: 'SPY', price: 512.23, change: 0.67, positive: true },
        { name: 'NASDAQ', price: 18123.45, change: 1.34, positive: true },
      ]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    initSocket()
    fetchMarkets()
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden w-full">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-0 -translate-x-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Market Ticker - Upgraded */}
      <div className="fixed top-16 sm:top-[80px] left-0 right-0 z-40 bg-brand-dark/90 backdrop-blur-xl border-b border-white/[0.08] text-white text-xs shadow-glass">
        <div className="flex items-center px-4 sm:px-6 py-2 sm:py-3 max-w-7xl mx-auto w-full overflow-hidden">
          <div className="mr-8 font-mono text-sm text-brand-muted tracking-wider hidden md:block shrink-0">
            {time}
          </div>
          <div className="mr-6 font-bold text-emerald-400 flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">MARKETS LIVE</span>
            <span className="sm:hidden">LIVE</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Ticker markets={markets} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 grid xl:grid-cols-2 gap-16 lg:gap-20 items-center w-full">
          {/* Left - Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 relative z-10"
          >
            {/* Announcement Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 bg-white/[0.03] backdrop-blur-md rounded-full text-sm font-medium border border-white/10 shadow-glass text-brand-text w-max"
            >
              <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full mr-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 font-bold">
                Level Up: Institutional Yields Access
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-[3.5rem] leading-[1] sm:text-6xl lg:text-[5rem] xl:text-[6rem] font-black tracking-tighter text-white drop-shadow-2xl">
              Engineered for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"> Wealth </span>
              Creation
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-brand-muted leading-relaxed max-w-lg font-medium pr-4">
              Alpsector bridges the gap between everyday investors and institutional-grade opportunities. Build your portfolio with Crypto, Equities, and Real Estate.
            </p>

            {/* Buttons Layout Bug Fix */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-max">
              <motion.a 
                href={isAuthenticated ? '/dashboard' : '/register'}
                whileTap={{ scale: 0.98 }}
                className="relative group w-full sm:w-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative px-8 py-5 bg-brand-surface/50 backdrop-blur-md rounded-xl hover:bg-transparent transition-colors duration-300 flex items-center justify-center gap-3">
                  <span className="font-black text-white text-lg tracking-wide">
                    {isAuthenticated ? 'Go to Dashboard' : 'Open Account'}
                  </span>
                  <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.a>
              
              <motion.a 
                href="/plans"
                whileTap={{ scale: 0.98 }}
                className="px-8 py-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 font-bold text-lg rounded-xl shadow-glass hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center text-white w-full sm:w-auto"
              >
                View Plans
              </motion.a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 items-center text-sm font-semibold text-brand-muted pt-8 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bank-Grade Security
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                100k+ Active Investors
              </div>
            </div>
          </motion.div>

          {/* Right - Asset Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 lg:pl-10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-[100px] rounded-full -z-10" />
            <AssetSlider markets={markets.map(m => ({
              ...m,
              labels: ['1m', '5m', '15m'],
              data: [m.price - 50, m.price - 10, m.price]
            }))} />
          </motion.div>
        </div>
      </section>

      {/* Components with updated styling will be below */}
      <AssetClasses />
      <SecurityTrust />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}
