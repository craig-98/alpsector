'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: <Shield className="w-12 h-12 text-blue-600" />,
    title: 'End-to-End Encryption',
    desc: 'Military-grade encryption protects all your data and transactions'
  },
  {
    icon: <CheckCircle className="w-12 h-12 text-emerald-600" />,
    title: 'Regulatory Compliance',
    desc: 'SEC registered and compliant with all federal regulations'
  },
  {
    icon: <Lock className="w-12 h-12 text-slate-600" />,
    title: 'SIPC Insured',
    desc: 'Your investments are protected up to $500,000 by SIPC insurance'
  }
]

import { Shield, CheckCircle, Lock } from "lucide-react"


export default function SecurityTrust() {
  return (
    <section className="py-24 bg-[#f5f6f8]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Header */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-5xl font-black text-slate-900 mb-3"
        >
          Bank-Level Security & Trust
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base text-slate-600 mb-16 max-w-2xl mx-auto leading-relaxed"
        >
          Your investments are protected with the highest security standards
        </motion.p>

        {/* Feature Cards */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 mb-14 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -6,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="w-full lg:w-[320px] bg-white rounded-2xl p-9 shadow-[0_8px_20px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_10px_35px_rgba(59,130,246,0.35)] transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-6 group-hover:text-blue-500/80 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Button */}
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: '#2563eb',
            color: 'white',
            boxShadow: '0 0 20px rgba(37,99,235,0.5)'
          }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 bg-[#eaf2ff] text-[#2563eb] font-medium px-12 py-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Your Security is Our Priority
        </motion.button>
      </div>
    </section>
  )
}

