'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface Stat {
  label: string
  value: string
  icon: string
  color: string
}

export default function StatsCounter() {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Users Online', value: '4,532', icon: <Users className="w-12 h-12 text-white" />, color: 'from-emerald-500 to-green-600' },
    { label: 'Total Invested', value: '$12.4M', icon: <DollarSign className="w-12 h-12 text-white" />, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Withdrawn', value: '$8.2M', icon: <ArrowDown className="w-12 h-12 text-white" />, color: 'from-purple-500 to-violet-600' },
    { label: 'Active Investments', value: '2,847', icon: <BarChart3 className="w-12 h-12 text-white" />, color: 'from-orange-500 to-orange-600' },
  ])


  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 group"
        >
          <div className={`w-20 h-20 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-xl group-hover:scale-110 transition-transform`}>
            {stat.icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition">{stat.label}</h3>
          <motion.div
            className={`text-4xl font-black ${index === 0 ? 'text-emerald-600' : index === 1 ? 'text-blue-600' : index === 2 ? 'text-purple-600' : 'text-orange-600'}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {stat.value}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  )
}

