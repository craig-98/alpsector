'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Inter } from 'next/font/google'
import Ticker from '@/components/Ticker'
import AssetSlider from '@/components/AssetSlider'
import AssetClasses from '@/components/AssetClasses'
import SecurityTrust from '@/components/SecurityTrust'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import { apiFetch, getDashboard } from '@/lib/api'
import { initSocket } from '@/lib/socket'




const inter = Inter({ subsets: ['latin'] })

const markets = [
  { name: 'SILVER', price: 22.89, change: 0.12, positive: true },
  { name: 'OIL', price: 78.34, change: -1.23, positive: false },
  { name: 'SPY', price: 4987.23, change: 0.67, positive: true },
  { name: 'NASDAQ', price: 15678.45, change: -0.34, positive: false },
  { name: 'TSLA', price: 433.27, change: 3.45, positive: true },
  { name: 'AAPL', price: 254.41, change: -0.56, positive: false },
]

export default function Home() {
  const [time, setTime] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)

    initSocket()
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
    <div className={inter.className}>
      {/* Market Ticker - Moved Lower */}
      <div className="sticky top-20 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white text-xs overflow-hidden mt-4">
        <div className="flex items-center px-6 py-3">
          <div className="mr-8 font-mono text-sm">
            {time}
          </div>
          <div className="mr-6 font-bold text-emerald-400">
            Markets ↑ Open
          </div>
          <Ticker markets={markets} />
          <div className="ml-6 text-emerald-400 animate-pulse">Live ●</div>
        </div>
      </div>



      {/* 3. Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Announcement Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-6 py-3 bg-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-lg max-w-max"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              New: Real Estate Investments Now Available
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-slate-900"
            >
              Invest In The{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Future
              </span>
              , One Asset At A Time
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg"
            >
              Earn more with expertly managed plans in crypto, stocks, real estate & more. 
              Join thousands of investors building wealth with our secure, regulated platform.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <motion.a 
                href={isAuthenticated ? '/plans' : '/register'}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-gray-900 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-3xl hover:bg-gray-800 transition-all duration-300 flex-grow sm:flex-none inline-block text-center"
              >
                Get Started →
              </motion.a>
              <motion.a 
                href="/plans"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-white border-2 border-black font-semibold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                See Plans
              </motion.a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-8 items-center text-sm text-slate-500"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                SEC Regulated
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Bank-Level Security
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                50K+ Investors
              </div>
            </motion.div>
          </motion.div>

          <AssetSlider markets={markets.map(m => ({
            ...m,
            labels: ['1m', '5m', '15m'],
            data: [m.price - 50, m.price - 10, m.price]
          }))} />
        </div>

      </section>

      {/* Asset Classes Section */}
      <AssetClasses />

      {/* Security Trust Section */}
      <SecurityTrust />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />
      <Footer />

    </div>
  )
}


