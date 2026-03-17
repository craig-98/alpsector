'use client'

import { motion } from 'framer-motion'

const assets = [
  {
    id: 1,
    title: 'Cryptocurrency',
    desc: 'Bitcoin, Ethereum, and top altcoins with secure custody',
    color: 'from-orange-400 to-orange-500',
    icon: <Bitcoin className="w-12 h-12 text-white" />
  },
  {
    id: 2,
    title: 'Stocks',
    desc: 'S&P 500, growth stocks, and dividend-paying equities',
    color: 'from-blue-500 to-blue-600',
    icon: <TrendingUp className="w-12 h-12 text-white" />
  },
  {
    id: 3,
    title: 'Real Estate',
    desc: 'REITs and fractional real estate investments',
    color: 'from-emerald-500 to-emerald-600',
    icon: <Building2 className="w-12 h-12 text-white" />
  },
  {
    id: 4,
    title: 'Commodities',
    desc: 'Gold, silver, oil products',
    color: 'from-amber-400 to-yellow-500',
    icon: <PackageCheck className="w-12 h-12 text-white" />
  },
  {
    id: 5,
    title: 'Bonds',
    desc: 'Government and corporate bonds with stable returns',
    color: 'from-slate-700 to-slate-800',
    bgIcon: 'bg-gradient-to-r from-blue-100 to-indigo-100',
    icon: <DollarSign className="w-12 h-12 text-slate-800" />
  },
  {
    id: 6,
    title: 'Agriculture',
    desc: 'Agricultural commodities and farming investment opportunities',
    color: 'from-green-500 to-emerald-600',
    icon: <Leaf className="w-12 h-12 text-white" />
  }
]

import { Bitcoin, TrendingUp, Building2, PackageCheck, DollarSign, Leaf } from "lucide-react"


export default function AssetClasses() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl lg:text-6xl font-black text-slate-900 mb-6"
        >
          Diversify Across Asset Classes
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto mb-20 leading-relaxed"
        >
          Build a balanced portfolio with access to multiple investment opportunities
        </motion.p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-slate-100 transition-all duration-300 h-full flex flex-col justify-between hover:bg-slate-50">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-lg ${asset.bgIcon || 'bg-gradient-to-br ' + asset.color}`}>
                  {asset.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors">
                  {asset.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-600 mb-10 flex-grow leading-relaxed">
                  {asset.desc}
                </p>
                
                {/* Button */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg ${
                    asset.id === 5 
                      ? 'bg-slate-800 text-white hover:bg-slate-900' 
                      : 'bg-slate-900 text-white hover:bg-slate-950'
                  }`}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

