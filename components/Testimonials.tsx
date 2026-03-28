'use client'

import { motion } from 'framer-motion'
import { User, Users, Star } from 'lucide-react'

const testimonials = [
  {
    quote: "Alpsector has transformed how I think about investing. The platform is incredibly intuitive, and the institutional yields have consistently exceeded my expectations.",
    author: "Sarah C.",
    role: "Portfolio Manager"
  },
  {
    quote: "The fixed income plans have been perfect for my diversification needs. Great support team and completely transparent fee structures. Truly a next-level platform.",
    author: "Michael R.",
    role: "Angel Investor"
  },
  {
    quote: "I highly recommend Alpsector to all my clients. The military-grade security features and strict regulatory compliance give me absolute confidence.",
    author: "David E.",
    role: "Financial Advisor"
  }
]

const stats = [
  { label: 'Avg ROI', value: '+31%', desc: 'Annualized' },
  { label: 'Custody', value: '$840M+', desc: 'Assets Secured' },
  { label: 'Satisfaction', value: '4.9/5', desc: 'Trustpilot Rating' }
]

export default function Testimonials() {
  return (
    <section className="py-32 bg-brand-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-dark.svg')] bg-center opacity-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">
            Trusted by the <span className="text-gradient-purple">Elite</span>
          </h2>
          <p className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            See what sophisticated investors are saying about scaling their wealth with Alpsector.
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:text-emerald-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-brand-muted uppercase tracking-widest mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-white/40">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => {
            const Icon = index === 0 ? User : index === 1 ? Users : Star;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative glass-panel glass-panel-hover p-10 rounded-3xl"
              >
                <div className="absolute -top-6 left-10 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                
                <svg className="absolute w-12 h-12 text-white/[0.03] top-10 right-8 -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>

                <p className="mt-8 text-[15px] sm:text-base text-brand-text leading-relaxed mb-6 font-medium z-10 relative">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4 relative z-10 border-t border-white/[0.05] pt-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-muted to-brand-surface flex items-center justify-center text-xs font-bold ring-2 ring-emerald-500/20">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {testimonial.author}
                    </div>
                    <div className="text-[12px] text-brand-muted">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
