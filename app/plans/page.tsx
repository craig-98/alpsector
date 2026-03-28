'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, DollarSign, BarChart3, ArrowRightLeft, Bitcoin, TrendingUp, Building2, Package, Percent, Leaf, Zap } from "lucide-react"
import { trialPlans } from './trialPlans'
import Footer from '@/components/Footer'
import { assets, investments as investmentsApi } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


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
  const router = useRouter()
  const [activeAsset, setActiveAsset] = useState('crypto')
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [amount, setAmount] = useState('')
  const [durationDays, setDurationDays] = useState(30)
  const [profit, setProfit] = useState(0)
  const [totalReturn, setTotalReturn] = useState(0)
  const [backendAssets, setBackendAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        const [stocks, etfs] = await Promise.all([
          assets.getStocks().catch(() => []),
          assets.getEtfs().catch(() => [])
        ])
        setBackendAssets([...stocks, ...etfs])
      } catch (err) {
        console.error('Failed to fetch assets:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }, [])

  const handleInvest = async (plan: any) => {
    try {
      if (!localStorage.getItem("token")) {
        toast.error("Please login to invest");
        router.push("/login");
        return;
      }

      let numAmount = parseFloat(amount);
      if (!amount || isNaN(numAmount) || numAmount === 0) {
        numAmount = plan.min;
      }

      if (numAmount < plan.min) {
        toast.error(`Minimum investment is $${plan.min}`);
        return;
      }

      await investmentsApi.create({
        plan: plan.name,
        amount: numAmount,
        type: activeAsset,
        symbol: plan.name.split(" ")[0].toUpperCase(), // Generate a simple symbol
        name: plan.name,
        percentageProfit: plan.apy, // Using APY as the profit percentage
        isRetirement: activeAsset === "retirement",
      });

      toast.success("Investment successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Investment failed");
    }
  };

  const currentPlans = (() => {
    let plans = activeAsset === 'stocks' ? stockPlans : 
               activeAsset === 'bonds' ? bondsPlans : 
               activeAsset === 'commodities' ? commoditiesPlans : 
               activeAsset === 'real-estate' ? realEstatePlans : 
               activeAsset === 'agriculture' ? agriculturePlans : 
               activeAsset === 'trial' ? trialPlans : cryptoPlans;

    // Add backend assets as plans if they match the active asset type
    if (activeAsset === 'stocks' || (activeAsset === 'crypto' && backendAssets.some(a => a.type === 'crypto'))) {
      const mappedAssets = backendAssets
        .filter(a => (activeAsset === 'stocks' && (a.type === 'stock' || a.type === 'etf')) || 
                     (activeAsset === 'crypto' && a.type === 'crypto'))
        .map(a => ({
          name: a.name || a.symbol,
          apy: a.change_percentage || 5.0,
          min: 100,
          max: Infinity,
          desc: `Direct investment in ${a.name || a.symbol}. Current price: $${a.price?.toLocaleString() || 'N/A'}`,
          icon: TrendingUp,
          colorIndex: 0,
          symbol: a.symbol
        }));
      return [...plans, ...mappedAssets];
    }
    return plans;
  })();

  const currentPlan = currentPlans[selectedPlan] || currentPlans[0] || cryptoPlans[0];
  const headerColors = ['bg-wine-100', 'bg-dark-grey-200', 'bg-wine-50', 'bg-dark-grey-100'];

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
    <div className="min-h-screen bg-brand-dark pt-[80px] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-wine-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Banner */}
      <section className="relative py-24 sm:py-32 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.nav 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-muted text-sm uppercase font-black tracking-[0.3em] mb-6 inline-block"
          >
            Home <span className="mx-3 opacity-30">/</span> Plans
          </motion.nav>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl sm:text-8xl font-black mb-8 tracking-tighter bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent"
          >
            Investment Plans
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-brand-muted max-w-2xl mx-auto font-medium"
          >
            Premium asset classes tailored for institutional-grade growth. Choose your path to financial freedom.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 space-y-32 pb-32">
        {/* Asset Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-[3rem] border border-white/10 shadow-2xl overflow-x-auto no-scrollbar"
        >
          <div className="flex gap-4 justify-between min-w-[1000px] lg:min-w-0">
            {assetClasses.map((asset) => {
              const Icon = asset.icon
              return (
                <motion.button
                  key={asset.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveAsset(asset.id)}
                  className={`group relative p-6 rounded-[2rem] transition-all duration-300 flex flex-col items-center gap-4 min-w-[140px] flex-1 ${
                    activeAsset === asset.id
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-transparent border border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${activeAsset === asset.id 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-white/5 text-brand-muted group-hover:bg-white/10 group-hover:text-white'
                  }`}>
                    {Icon}
                  </div>
                  <span className={`font-black text-[10px] uppercase tracking-[0.2em] transition-colors ${activeAsset === asset.id ? 'text-white' : 'text-brand-muted group-hover:text-white'}`}>
                    {asset.label}
                  </span>
                  {activeAsset === asset.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-400 rounded-full"
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center p-20 space-y-6">
              <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-xl font-black text-white uppercase tracking-widest">Scanning Markets...</p>
            </div>
          ) : (
            currentPlans.map((plan, index) => (
              <motion.div
                key={plan.name + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                className={`group relative glass-panel rounded-[3rem] p-10 border transition-all duration-500 ${selectedPlan === index ? 'border-emerald-500/50 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10' : 'border-white/5 hover:border-white/20'}`}
                onClick={() => setSelectedPlan(index)}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                    {plan.icon ? <plan.icon className="w-10 h-10 text-white" /> : <TrendingUp className="w-10 h-10 text-white" />}
                  </div>
                  <div className="bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                    <span className="text-emerald-400 font-black text-sm">{plan.apy}% APY</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 tracking-tight leading-tight uppercase italic underline decoration-emerald-500/30">
                  {plan.name}
                </h3>
                
                <p className="text-brand-muted font-medium text-sm leading-relaxed mb-10">
                  {plan.desc}
                </p>

                <div className="space-y-6 mb-12">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Threshold</p>
                    <p className="text-xl font-black text-white">
                      ${plan.min.toLocaleString()} <span className="text-brand-muted text-sm mx-2">to</span> ${plan.max === Infinity ? 'Unlimited' : plan.max.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInvest(plan);
                  }}
                  className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all relative overflow-hidden group/btn ${
                    selectedPlan === index 
                      ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span className="relative z-10">Invest Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </button>
              </motion.div>
            )))
          }
        </div>

        {/* Sophisticated Calculator */}
        <section className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[4rem] p-12 sm:p-20 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            
            <div className="text-center mb-16 sm:mb-20">
              <h3 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tighter">
                Profit Engine
              </h3>
              <p className="text-lg text-brand-muted font-medium">Model your wealth trajectory with precision analytics.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Inputs */}
              <div className="space-y-10">
                <div className="group">
                  <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-4 group-hover:text-emerald-400 transition-colors">
                    Selected Strategy
                  </label>
                  <select 
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(parseInt(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-xl text-white font-black appearance-none focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all cursor-pointer"
                  >
                    {currentPlans.map((plan, index) => (
                      <option key={plan.name} value={index} className="bg-brand-surface">{plan.name}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-4 group-hover:text-emerald-400 transition-colors">
                    Deployment Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-white/20">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="5,000"
                      className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 pl-12 text-3xl text-white font-black focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-right"
                      min={currentPlan.min}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em]">Temporal Duration</label>
                    <span className="text-2xl font-black text-emerald-400">{durationDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="365"
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative glass-panel rounded-[3rem] p-10 border border-white/10 bg-white/5 space-y-10">
                  <div className="text-center group/item">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-4 group-hover/item:text-emerald-400 transition-colors">Total Accrued Profit</p>
                    <p className="text-6xl sm:text-7xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      {formatCurrency(profit)}
                    </p>
                  </div>
                  
                  <div className="h-px bg-white/10" />
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-2">Daily Yield</p>
                      <p className="text-2xl font-black text-white">
                        {formatCurrency(profit / durationDays)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] mb-2">End Value</p>
                      <p className="text-2xl font-black text-white">
                        {formatCurrency(totalReturn)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-20">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInvest(currentPlan)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-2xl px-16 py-8 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] transition-all uppercase tracking-[0.2em]"
              >
                Initiate Position
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="text-center mb-20 space-y-4">
            <h3 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic decoration-emerald-500/30 underline underline-offset-8">
              Protocol
            </h3>
            <p className="text-xl text-brand-muted font-medium">Simplified 6-step lifecycle for every asset class.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group glass-panel p-10 rounded-[3rem] border border-white/5 hover:border-emerald-500/30 transition-all text-center"
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <step.icon className="w-10 h-10 text-emerald-400" />
                </div>
                <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{step.title}</h4>
                <p className="text-brand-muted font-medium text-sm leading-relaxed">{step.desc}</p>
                <div className="mt-8 text-[4rem] font-black text-white/[0.02] absolute bottom-4 right-8 pointer-events-none group-hover:text-emerald-500/[0.05] transition-colors">
                  0{index + 1}
                </div>
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
