'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'WHAT IS ALPSECTOR AND HOW DOES IT WORK?',
    answer: 'Alpsector is an institutional-grade investment platform bridging the gap between everyday investors and high-yield asset classes. We offer curated investment vehicles spanning Cryptocurrencies, Equities, Bonds, and Real Estate. Members choose a plan, deposit funds, and our automated systems execute trading strategies to generate consistent yields.'
  },
  {
    question: 'IS MY PORTFOLIO SECURE AND REGULATED?',
    answer: 'Absolutely. Alpsector adheres to rigorous global regulatory frameworks. Client funds are kept in segregated bank accounts and cold-storage vaults with our institutional custody partners. Our platform utilizes military-grade AES-256 encryption and requires mandatory Two-Factor Authentication (2FA) for all accounts.'
  },
  {
    question: 'WHAT ARE THE MINIMUM INVESTMENT REQUIREMENTS?',
    answer: 'We believe in democratizing access to wealth. Our entry-level plans start at just $100 for core asset classes. Premium institutional plans, which offer aggressive yields and dedicated account managers, typically have higher entry thresholds ranging from $5,000 to $50,000.'
  },
  {
    question: 'WHEN AND HOW CAN I WITHDRAW MY FUNDS?',
    answer: 'Withdrawals depend on your chosen investment plan. Standard liquid plans allow for flexible withdrawals processed within 24-48 hours. Fixed-term plans lock your capital for a specified period to maximize compound yields. Returns can be systematically reinvested or withdrawn to your linked crypto wallet or bank account.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 sm:py-32 bg-brand-dark relative z-10 border-t border-brand-border/50">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-surface to-brand-dark -z-10" />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 drop-shadow-md">
            Common <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Everything you need to know about scaling your wealth with Alpsector.
          </p>
        </motion.div>

        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full flex items-center justify-between p-6 sm:p-8 border rounded-2xl transition-all duration-300 ${
                  openIndex === index 
                    ? 'bg-brand-surface border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                    : 'glass-panel border-white/[0.05] hover:border-emerald-500/20'
                }`}
              >
                <h3 className="text-left text-sm sm:text-base font-bold text-white tracking-wide leading-tight group-hover:text-emerald-400 transition-colors pr-8">
                  {faq.question}
                </h3>
                <motion.div 
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-brand-muted group-hover:bg-white/10 group-hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 sm:p-8 pt-0 mt-2">
                      <p className="text-sm sm:text-base text-brand-muted leading-relaxed pl-4 border-l-2 border-emerald-500/30">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.a 
            href="mailto:support@alpsector.com"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16,185,129,0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-3 bg-brand-surface border border-emerald-500/30 text-emerald-400 font-bold px-10 py-4 rounded-xl shadow-glass hover:bg-emerald-500/10 transition-all duration-300"
          >
            Still have questions? Contact Support
          </motion.a>
        </div>
      </div>
    </section>
  )
}
