'use client'

import { motion } from 'framer-motion'
import { TrendingUp, DollarSign } from 'lucide-react'

interface AssetCardProps {
  name: string
  price: string
  change: string
  positive: boolean
}

export default function AssetCard({ name, price, change, positive }: AssetCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 max-w-sm mx-auto"
    >
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mr-4">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{name}</h3>
          <p className="text-sm text-slate-500">Live Price</p>
        </div>
      </div>
      <div className="text-center mb-8">
        <motion.div 
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-5xl font-black text-slate-900 mb-2"
        >
          {price}
        </motion.div>
        <div className={`text-2xl font-bold flex items-center justify-center ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {positive ? '↑' : '↓'} {change}
        </div>
      </div>
      <div className="flex items-center justify-center text-xs text-slate-500 space-x-1">
        Updated: 
        <div className="flex space-x-0.5">
          <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}
