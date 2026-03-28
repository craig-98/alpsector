'use client'

import { motion } from 'framer-motion'
import { Bitcoin, TrendingUp, Building2, PackageCheck, DollarSign, Leaf } from "lucide-react"

const assets = [
  {
    id: 1,
    title: 'Cryptocurrency',
    desc: 'Bitcoin, Ethereum, and top altcoins with secure custody.',
    color: 'from-orange-400 to-amber-500',
    icon: <Bitcoin className="w-8 h-8 text-white relative z-10" />
  },
  {
    id: 2,
    title: 'Equities',
    desc: 'S&P 500, growth stocks, and top dividend-paying equities.',
    color: 'from-blue-500 to-cyan-500',
    icon: <TrendingUp className="w-8 h-8 text-white relative z-10" />
  },
  {
    id: 3,
    title: 'Real Estate',
    desc: 'High-yield REITs and fractionalized real estate investments.',
    color: 'from-emerald-400 to-teal-500',
    icon: <Building2 className="w-8 h-8 text-white relative z-10" />
  },
  {
    id: 4,
    title: 'Commodities',
    desc: 'Diversify with physically-backed Gold, Silver, and Oil assets.',
    color: 'from-yellow-400 to-orange-500',
    icon: <PackageCheck className="w-8 h-8 text-white relative z-10" />
  },
  {
    id: 5,
    title: 'Fixed Income',
    desc: 'Government bonds and corporate debt for stable portfolio baseline.',
    color: 'from-purple-500 to-pink-500',
    icon: <DollarSign className="w-8 h-8 text-white relative z-10" />
  },
  {
    id: 6,
    title: 'ESG & Agriculture',
    desc: 'Invest in sustainable farming and green commodities worldwide.',
    color: 'from-green-400 to-emerald-600',
    icon: <Leaf className="w-8 h-8 text-white relative z-10" />
  }
]

export default function AssetClasses() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-brand-dark/50 border-y border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md"
          >
            Diversify Across <span className="text-gradient">Asset Classes</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg sm:text-xl text-brand-muted leading-relaxed"
          >
            A multi-asset strategy built for resilience. Access institutional-quality markets from a single, intuitive interface.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group h-full"
            >
              <div className="relative h-full p-8 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between overflow-hidden">
                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gradient-to-br ${asset.color} opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`} />
                
                <div>
                  <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${asset.color} opacity-80`} />
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
                    {asset.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-muted transition-all">
                    {asset.title}
                  </h3>
                  
                  <p className="text-brand-muted leading-relaxed mb-8 flex-grow">
                    {asset.desc}
                  </p>
                </div>
                
                <motion.a 
                  href="/plans"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 shadow-sm hover:shadow-glass group/btn"
                >
                  Explore {asset.title}
                  <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
