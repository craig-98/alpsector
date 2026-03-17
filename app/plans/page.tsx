'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, DollarSign, BarChart3, ArrowRightLeft, Bitcoin, TrendingUp, Building2, Package, Percent, Leaf, Zap } from "lucide-react"
import { trialPlans } from './trialPlans'
import Footer from '@/components/Footer'


const assetClasses = [
  { id: 'crypto', label: 'Cryptocurrency', icon: <Bitcoin className="w-6 h-6" />, color: 'from-wine-400 to-wine-500' },
  { id: 'stocks', label: 'Stocks', icon: <TrendingUp className="w-6 h-6" />, color: 'from-dark-grey-500 to-black' },
  { id: 'real-estate', label: 'Real Estate', icon: <Building2 className="w-6 h-6" />, color: 'from-wine-400 to-black' },
  { id: 'commodities', label: 'Commodities', icon: <Package className="w-6 h-6" />, color: 'from-dark-grey-400 to-dark-grey-600' },
  { id: 'bonds', label: 'Bonds', icon: <DollarSign className="w-6 h-6" />, color: 'from-black to-dark-grey-600' },
  { id: 'agriculture', label: 'Agriculture', icon: <Leaf className="w-6 h-6" />, color: 'from-dark-grey-500 to-wine-500' },
{ id: 'trial', label: 'Trial Plan', icon: <Zap className="w-6 h-6" />, color: 'from-emerald-400 to-emerald-600' },
]


const cryptoPlans = [
  {
    name: 'Dollar cost averaging starter',
    apy: 5.2,
    min: 350,
    max: 1000,
    desc: 'Gain exposure to the crypto market without risking a significant portion of your capital. Duration --- 2 days',
    icon: Bitcoin,
    colorIndex: 0
  },
  {
    name: 'The "core and explore" portfolio',
    apy: 7.8,
    min: 1000,
    max: 5000,
    desc: 'Balance the stability of major cryptos with the growth potential of smaller projects. Duration --- 3 days',
    icon: Bitcoin,
    colorIndex: 1
  },
  {
    name: 'The "diversified and secure" strategy',
    apy: 12.4,
    min: 5000,
    max: Infinity,
    desc: 'Professional grade security and a sophisticated income generating portfolio. Duration --- 5 days',
    icon: Bitcoin,
    colorIndex: 2
  }
]

const stockPlans = [
  {
    name: 'The "Foundation" Portfolio',
    apy: 5.2,
    min: 350,
    max: 1000,
    desc: 'Maximum diversification with minimal effort and cost. Duration --- 2 days',
    icon: TrendingUp,
    colorIndex: 0
  },
  {
    name: 'The "Core & Satellite" Strategy',
    apy: 7.8,
    min: 1000,
    max: 5000,
    desc: 'Maintaining a diversified core while exploring opportunities for outperformance. Duration --- 3 days',
    icon: TrendingUp,
    colorIndex: 1
  },
  {
    name: 'The "Diversified & Income" Portfolio',
    apy: 12.4,
    min: 5000,
    max: Infinity,
    desc: 'Sophisticated asset allocation, wealth preservation, and generating income. Duration --- 5 days',
    icon: TrendingUp,
    colorIndex: 2
  }
]

const commoditiesPlans = [
  {
    name: 'The "Digital Gold" Approach',
    apy: 5.2,
    min: 350,
    max: 1000,
    desc: 'Simple, low-cost inflation hedging. Duration --- 2 days',
    icon: Package,
    colorIndex: 0
  },
  {
    name: 'The "Broad Basket" Strategy',
    apy: 7.8,
    min: 1000,
    max: 5000,
    desc: 'A more robust hedge against different types of economic shifts. Duration --- 3 days',
    icon: Package,
    colorIndex: 1
  },
  {
    name: 'The "Direct & Futures" Portfolio',
    apy: 12.4,
    min: 5000,
    max: Infinity,
    desc: 'Direct ownership and a more powerful, non-correlated hedge.',
    icon: Package,
    colorIndex: 2
  }
]

const bondsPlans = [
  {
    name: 'The "ETF" Entry',
    apy: 5.2,
    min: 350,
    max: 1000,
    desc: 'Simple, diversified exposure to the entire bond market. Duration --- 2 days',
    icon: DollarSign,
    colorIndex: 0
  },
  {
    name: 'The "Ladder" Builder',
    apy: 7.8,
    min: 1000,
    max: 5000,
    desc: 'Creating a predictable income stream while reducing interest rate risk. Duration --- 3 days',
    colorIndex: 1
  },
  {
    name: 'The "Barbell" Strategy',
    apy: 12.4,
    min: 5000,
    max: Infinity,
    desc: 'Optimizing the trade-off between safety, income, and interest rate risk. Duration --- 5 days',
    colorIndex: 2
  }
]

const realEstatePlans = [
  {
    name: 'The "REIT" Starter',
    apy: 5.2,
    min: 350,
    max: 1000,
    desc: 'Low-cost entry through diversified Real Estate Investment Trusts.',
    icon: Building2,
    colorIndex: 0
  },
  {
    name: 'The "Diversified Portfolio"',
    apy: 7.8,
    min: 1000,
    max: 5000,
    desc: 'Balanced mix of residential, commercial, and industrial properties.',
    colorIndex: 1
  },
  {
    name: 'The "Direct Ownership" Strategy',
    apy: 12.4,
    min: 5000,
    max: Infinity,
    desc: 'Direct property investments with professional management.',
    colorIndex: 2
  }
]

const agriculturePlans = [
  {
    name: 'The "Crop Futures" Starter',
    apy: 5.2,
    min: 350,
    max: 1000,
    desc: 'Entry-level exposure to agricultural commodity futures.',
    icon: Leaf,
    colorIndex: 0
  },
  {
    name: 'The "Farm Index" Portfolio',
    apy: 7.8,
    min: 1000,
    max: 5000,
    desc: 'Diversified index tracking major crops and farmland.',
    colorIndex: 1
  },
  {
    name: 'The "Direct Farmland" Strategy',
    apy: 12.4,
    min: 5000,
    max: Infinity,
    desc: 'Ownership stakes in productive farmland assets.',
    colorIndex: 2
  }
]



const steps = [
  { icon: User, title: 'Register Account', desc: 'Create your free account in less than 2 minutes' },
  { icon: Mail, title: 'Verify Email', desc: 'Confirm your email address to activate account' },
  { icon: Shield, title: 'Verify KYC', desc: 'Complete identity verification for security' },
  { icon: DollarSign, title: 'Deposit Money', desc: 'Fund your account using bank or crypto' },
  { icon: BarChart3, title: 'Invest in a Plan', desc: 'Choose and start your investment plan' },
  { icon: ArrowRightLeft, title: 'Transfer Money', desc: 'Withdraw profits anytime to your account' }
];

export default function PlansPage() {
  const [activeAsset, setActiveAsset] = useState('crypto')
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [amount, setAmount] = useState('')
  const [durationDays, setDurationDays] = useState(30)
  const [profit, setProfit] = useState(0)
  const [totalReturn, setTotalReturn] = useState(0)

  const currentPlans = activeAsset === 'stocks' ? stockPlans : activeAsset === 'bonds' ? bondsPlans : activeAsset === 'commodities' ? commoditiesPlans : activeAsset === 'real-estate' ? realEstatePlans : activeAsset === 'agriculture' ? agriculturePlans : activeAsset === 'trial' ? trialPlans : cryptoPlans
  const currentPlan = currentPlans[selectedPlan]
  const headerColors = ['#e5e7eb', '#d1d5db', '#cbd5e1']

  const calculateProfit = useCallback(() => {
    const numAmount = parseFloat(amount) || 0
    const apy = currentPlan.apy
    if (numAmount < currentPlan.min) return

    // Daily compound interest: profit = amount * (1 + daily_rate)^days - amount
    const dailyRate = (apy / 100) / 365
    const finalAmount = numAmount * Math.pow(1 + dailyRate, durationDays)
    const calculatedProfit = finalAmount - numAmount
    const calculatedTotal = finalAmount

    setProfit(calculatedProfit)
    setTotalReturn(calculatedTotal)
  }, [amount, currentPlan, durationDays])

  useEffect(() => {
    calculateProfit()
  }, [amount, selectedPlan, durationDays, calculateProfit])



  return (
    <div className="min-h-screen bg-dark-grey-50 pt-[80px]">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-black to-dark-grey-900 text-white py-20 sm:py-28 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <nav className="text-dark-grey-300 text-base sm:text-lg mb-4 inline-block">
            Home <span className="mx-2">/</span> Plans
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 drop-shadow-2xl leading-tight">
            INVESTMENT PLANS
          </h1>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 -mt-20 relative z-10 space-y-24 pb-24">
        {/* Asset Filter Buttons */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-wrap gap-4 justify-center">
            {assetClasses.map((asset) => {
              const Icon = asset.icon
              return (
                <motion.button
                  key={asset.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveAsset(asset.id)}
                  className={`group relative p-6 rounded-3xl shadow-lg transition-all duration-300 flex flex-col items-center gap-3 min-w-[160px] ${
                    activeAsset === asset.id
                      ? 'bg-black text-white shadow-2xl shadow-wine-500/25'
                      : 'bg-white text-dark-grey-900 hover:shadow-xl hover:shadow-dark-grey-200/50'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${activeAsset === asset.id 
                    ? 'bg-white/20' 
                    : 'bg-gradient-to-br from-wine-500 to-dark-grey-700'
                  }`}>
                    <span className="text-2xl">{Icon}</span>
                  </div>
                  <span className="font-semibold text-sm uppercase tracking-wide">{asset.label}</span>
                  {activeAsset === asset.id && (
                    <motion.div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-4 border-dark-grey-100"
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Our Investment Plans
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            The plans we offer are specifically designed for you.
            Choose an investment plan that fits your financial goals and start earning profits.
          </p>
        </motion.div>

        {/* Plan Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {currentPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-white rounded-[14px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden cursor-pointer border hover:border-transparent"
              onClick={() => setSelectedPlan(index)}
            >
              <div 
                className={`h-[70px] sm:h-[90px] rounded-t-[14px] ${headerColors[index]}`}
              />
              <div className="relative -mt-6 sm:-mt-8">
                <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto bg-gradient-to-br from-black to-dark-grey-900 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white">
                  {plan.icon ? <plan.icon className="w-8 sm:w-10 h-8 sm:h-10 text-white drop-shadow-lg" /> : <TrendingUp className="w-8 sm:w-10 h-8 sm:h-10 text-white drop-shadow-lg" />}
                </div>
              </div>
              <div className="p-6 sm:p-[30px]">
                <h3 className="text-lg sm:text-[20px] font-semibold text-[#111827] mb-3 leading-tight">
                  {plan.name}
                </h3>
                <p className="text-[#374151] font-bold text-base sm:text-lg mb-4">
                  {plan.apy}% APY
                </p>
                <div className="mb-6">
                  <p className="text-sm font-medium text-[#4b5563] uppercase tracking-wide mb-1">
                    Minimum Investment
                  </p>
                  <p className="text-xl font-semibold text-[#111827]">
                    ${plan.min} - ${plan.max === Infinity ? '+' : plan.max.toLocaleString()}
                  </p>
                </div>
                <p className="text-[#4b5563] leading-relaxed mb-8">
                  {plan.desc}
                </p>
                <button className="w-full px-[22px] py-[10px] border border-[#9ca3af] bg-transparent rounded-lg text-[#4b5563] font-medium hover:bg-[#374151] hover:text-white hover:border-transparent transition-all duration-300 uppercase tracking-wide text-sm">
                  Invest Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sophisticated Calculator */}
        <section className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50"
          >
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 text-center mb-8 sm:mb-12">
              Investment Calculator
            </h3>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Inputs */}
              <div className="space-y-6">
                <div>
                <label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4">
                    Investment Plan
                  </label>
                  <select 
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(parseInt(e.target.value))}
                    className="w-full p-4 sm:p-6 rounded-2xl border-2 border-slate-200 text-base sm:text-xl bg-slate-50 focus:border-emerald-500 focus:ring-4 ring-emerald-500/20 transition-all font-semibold min-h-[48px]"
                  >
                    {currentPlans.map((plan, index) => (
                      <option key={index} value={index}>{plan.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4">
                    Investment Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="$1,000"
                    className="w-full p-4 sm:p-6 rounded-2xl border-2 border-slate-200 text-lg sm:text-2xl bg-slate-50 focus:border-emerald-500 focus:ring-4 ring-emerald-500/20 transition-all font-semibold text-right min-h-[48px]"
                    min={currentPlan.min}
                    step="50"
                  />
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    Min: ${currentPlan.min.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4">
                    Investment Duration
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="365"
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-slate-500 mt-2">
                    <span>7 days</span>
                    <span>{durationDays} days</span>
                    <span>1 year</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-2xl p-8 border border-emerald-200/50">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-slate-700 mb-2">
                    Projected Returns
                  </p>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-500 uppercase tracking-wide">Daily Profit</p>
                      <p className="text-4xl font-black text-emerald-600">
                        {formatCurrency(profit / durationDays)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-500 uppercase tracking-wide">Total Profit</p>
                      <p className="text-5xl font-black text-emerald-600 bg-emerald-100/50 rounded-2xl p-6">
                        {formatCurrency(profit)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-500 uppercase tracking-wide">Total Return</p>
                      <p className="text-4xl font-black text-blue-600">
                        {formatCurrency(totalReturn)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-black to-dark-grey-900 hover:from-dark-grey-900 hover:to-black text-white font-black text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-black/50 transition-all duration-300 uppercase tracking-wide"
              >
                Start Investing
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 text-center mb-12 sm:mb-16">
            How It Works
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="group text-center p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl border border-slate-200 hover:border-emerald-200 transition-all duration-500 hover:bg-emerald-50"
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-r from-black to-dark-grey-900 shadow-2xl group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                  <User className="w-12 h-12 text-white font-bold" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h4>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )

}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value)
}
