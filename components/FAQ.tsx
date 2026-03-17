'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'WHAT IS GRANDVEST AND HOW DOES IT WORK?',
    answer: 'GrandVest is a comprehensive investment platform that allows you to invest in various asset classes including cryptocurrencies, commodities, real estate, stocks, and bonds. We provide curated investment plans that are managed by experts, making it easy for both beginners and experienced investors to grow their wealth.'
  },
  {
    question: 'IS GRANDVEST REGULATED AND SECURE?',
    answer: 'Yes, GrandVest operates under strict regulatory guidelines and employs bank-level security measures to protect your investments and personal information. We use SSL encryption, two-factor authentication, and store the majority of digital assets in cold storage for maximum security.'
  },
  {
    question: 'WHAT ARE THE MINIMUM INVESTMENT REQUIREMENTS?',
    answer: 'GrandVest offers flexible investment options starting from as low as $100 for some plans, making it accessible to investors with different budget levels. Specific minimums vary by investment type, with cryptocurrency plans starting at $100 and real estate investments requiring a minimum of $1,000.'
  },
  {
    question: 'HOW ARE RETURNS GENERATED AND PAID OUT?',
    answer: 'Returns are generated through a combination of capital appreciation, dividends, interest, and staking rewards depending on your selected investment plan. Payouts are typically made quarterly, but some plans offer monthly distributions. You can choose to reinvest your returns or withdraw them to your linked bank account.'
  },
  {
    question: 'CAN I WITHDRAW MY FUNDS AT ANY TIME?',
    answer: 'Withdrawal options depend on your selected investment plan. Some plans like certain cryptocurrency and stock investments allow for flexible withdrawals, while others like real estate and agricultural plans have specific lock-up periods to maximize returns. Most plans allow partial withdrawals with 3-5 business days processing time.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-dark-grey-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-black mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-dark-grey-600 max-w-2xl mx-auto">
            Find answers to common questions about GrandVest and our investment services.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-8 bg-white border border-dark-grey-200 rounded-2xl hover:shadow-xl hover:border-dark-grey-300 transition-all duration-300 hover:bg-dark-grey-50"
              >
                <h3 className="text-2xl font-black uppercase text-black tracking-wide leading-tight">
                  {faq.question}
                </h3>
                <motion.div 
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  className="w-8 h-8 p-1 rounded-lg bg-gradient-to-r from-wine-900 to-black text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-200"
                >
                  <span className="text-xl">▼</span>
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 pt-0 bg-gradient-to-r from-dark-grey-50 to-dark-grey-100 border-x border-b border-dark-grey-200 rounded-b-2xl">
                      <p className="text-lg text-dark-grey-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-wine-600 hover:bg-wine-700 text-white font-semibold px-12 py-5 rounded-2xl shadow-2xl hover:shadow-wine-500/50 transition-all duration-300 text-lg"
          >
            🛡️ Contact Support
          </motion.button>
        </div>
      </div>
    </section>
  )
}
