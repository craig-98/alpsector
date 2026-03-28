'use client'

import { motion } from 'framer-motion'
import { Shield, CheckCircle, Lock } from "lucide-react"

const features = [
  {
    icon: <Shield className="w-10 h-10 text-cyan-400" />,
    title: 'Bank-Grade Encryption',
    desc: 'AES-256 encryption protects your assets and personal data in transit and at rest.'
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-emerald-400" />,
    title: 'Regulated & Compliant',
    desc: 'Licensed digital asset custodian with strict KYC/AML policy enforcement.'
  },
  {
    icon: <Lock className="w-10 h-10 text-emerald-500" />,
    title: 'Cold Storage Vaults',
    desc: '95% of digital assets are stored in multi-signature cold wallets completely offline.'
  }
]

export default function SecurityTrust() {
  return (
    <section className="py-24 sm:py-32 bg-brand-dark relative overflow-hidden text-center border-b border-brand-border/50">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Security First</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            Institutional <span className="text-gradient">Security</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-muted mb-16 max-w-2xl mx-auto leading-relaxed">
            Your investments are protected by industry-leading security architecture. We never cut corners when it comes to safeguarding your wealth.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group glass-panel glass-panel-hover p-10 flex flex-col items-center text-center relative overflow-hidden rounded-2xl"
            >
              {/* Top border highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-150 group-hover:bg-cyan-500/20 transition-colors duration-500" />
                <div className="w-20 h-20 rounded-2xl glass-panel border border-white/10 flex items-center justify-center relative shadow-inner">
                   {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
