    "use client"

import { motion } from 'framer-motion'
import { User, Users, Star } from 'lucide-react'

const testimonials = [
  {
    quote: "Alpsector has transformed how I think about investing. The platform is intuitive and the returns have exceeded my expectations.",
    author: "Sarah Chen",
    role: "Software Engineer"
  },
  {
    quote: "The Gold plan has been perfect for my portfolio diversification needs. Great support team and transparent pricing. Alpsector is amazing!",
    author: "Michael Rodriguez",
    role: "Business Owner"
  },
  {
    quote: "I recommend Alpsector to my clients. The security features and regulatory compliance give me confidence.",
    author: "Emily Johnson",
    role: "Financial Advisor"
  }
]

const stats = [
  {
    label: 'Average Growth',
    value: '+62.7%',
    desc: 'Across All Success Stories'
  },
  {
    label: 'Client Satisfaction',
    value: '4.9/5',
    desc: 'Average Ratings'
  },
  {
    label: 'Success Rate',
    value: '94%',
    desc: 'positive Returns'
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            See what our investors are saying about their experience
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => {
            const Icon = index === 0 ? User : index === 1 ? Users : Star;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-black to-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl p-2">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-lg text-slate-700 leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="font-semibold text-slate-900">
                    {testimonial.author}
                  </div>
                  <span className="ml-2 text-sm text-slate-500">• {testimonial.role}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group text-center p-8 rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100 hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-black to-slate-900 bg-opacity-20 text-slate-200 px-4 py-2 rounded-full mb-4 font-semibold">
                <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                Alpsector
              </div>
              <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-slate-500 text-sm mt-1">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

