'use client'

import {
  Lock,
  Zap,
  Target,
  Eye,
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <div className="min-h-screen bg-brand-dark overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
          <div className="text-center mb-32">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-emerald-200 to-gray-400 bg-clip-text text-transparent mb-8 tracking-tighter"
            >
              Our Mission
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-brand-muted max-w-3xl mx-auto font-medium leading-relaxed"
            >
              We are democratizing digital wealth by making institutional-grade investment strategies accessible to everyone, anywhere.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
                Advanced tech meets <span className="text-emerald-400">financial mastery</span>
              </h2>
              <p className="text-lg text-brand-muted mb-10 leading-relaxed font-medium">
                Our platform combines cutting-edge algorithmic trading with decades of market expertise. We don't just follow trends; we identify patterns that human eyes overlook, executing precise moves 24/7 across global markets.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-[2rem] border border-white/5 group hover:border-emerald-500/30 transition-all">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Lock className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h4 className="font-black text-xl text-white mb-3">
                    Ironclad Security
                  </h4>
                  <p className="text-brand-muted text-sm font-medium leading-relaxed">
                    Bank-grade encryption and multi-sig protocols for every transaction.
                  </p>
                </div>
                <div className="glass-panel p-8 rounded-[2rem] border border-white/5 group hover:border-blue-500/30 transition-all">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-blue-400" />
                  </div>
                  <h4 className="font-black text-xl text-white mb-3">Instant Execution</h4>
                  <p className="text-brand-muted text-sm font-medium leading-relaxed">
                    HFT systems that execute trades in milliseconds across the globe.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
              <div className="relative glass-panel rounded-[3rem] p-12 border border-white/10 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <h3 className="text-3xl font-black text-white mb-8 tracking-tight">
                  Global Market Reach
                </h3>
                <p className="text-emerald-100/70 text-lg mb-10 font-medium">
                  Direct access to over 200+ markets including Crypto, Forex, Indices, and Commodities.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Crypto', value: '50+ pairs', color: 'emerald' },
                    { label: 'Forex', value: '100+ pairs', color: 'blue' },
                    { label: 'Indices', value: '25+ markets', color: 'purple' },
                    { label: 'Commodities', value: '20+ assets', color: 'orange' }
                  ].map((market) => (
                    <div key={market.label} className="bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5 hover:bg-white/10 transition-colors">
                      <div className="font-black text-white mb-1 uppercase tracking-widest text-[10px]">
                        {market.label}
                      </div>
                      <div className="text-emerald-400 font-black text-lg">{market.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {[
              { icon: Target, title: 'Mission', desc: 'Democratize elite financial tools for the modern digital investor.', color: 'emerald' },
              { icon: Eye, title: 'Vision', desc: 'To be the undisputed leader in AI-driven wealth management by 2026.', color: 'purple' },
              { icon: Globe, title: 'Network', desc: 'Securely serving 150,000+ investors across 140 countries.', color: 'blue' }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-panel rounded-[2.5rem] p-10 text-center border border-white/5 hover:border-white/10 transition-all"
              >
                <div className={`w-20 h-20 mx-auto flex items-center justify-center mb-8 rounded-3xl bg-${item.color}-500/10 border border-${item.color}-500/20 shadow-xl`}>
                  <item.icon className={`w-10 h-10 text-${item.color}-400`} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-brand-muted font-medium leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Our Team Section */}
          <section className="py-20">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                The Architects
              </h2>
              <p className="text-xl text-brand-muted max-w-2xl mx-auto font-medium">
                The minds driving innovation at Alpinvest
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { name: 'Michael Thompson', role: 'CEO & Founder', img: '/davidnicholls.JPG', ig: '@michaelthompson', desc: 'Ex-Hedge Fund Manager' },
                { name: 'Sarah Chen', role: 'CTO', initials: 'SC', ig: '@sarahchen', desc: 'Machine Learning Expert' },
                { name: 'David Nicholls', role: 'CFO', img: '/toddpresely.JPG', ig: '@davidnicholls', desc: 'Financial Strategist' }
              ].map((member, i) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-panel group rounded-[3rem] p-10 border border-white/5 hover:border-emerald-500/20 transition-all text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {member.img ? (
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-32 h-32 rounded-[2rem] mx-auto shadow-2xl object-cover mb-8 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-[2rem] mx-auto shadow-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-white font-black text-3xl">
                        {member.initials}
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-4">{member.role}</p>
                  <p className="text-brand-muted text-sm font-medium mb-8">
                    {member.desc}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-white/50 hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                    <span className="text-xs font-black tracking-widest uppercase">{member.ig}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Get In Touch Section */}
          <section className="py-32 border-t border-white/5">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                Connect With Us
              </h2>
              <p className="text-xl text-brand-muted max-w-2xl mx-auto font-medium">
                Our support team is available 24/7 to assist with your journey.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Mail, label: 'Email', value: 'support@grandvest.org', color: 'emerald', link: 'mailto:support@grandvest.org' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', color: 'blue', link: 'tel:+15551234567' },
                { icon: MapPin, label: 'Office', value: '123 Main St, NY', color: 'orange' }
              ].map((card) => (
                <motion.div 
                  key={card.label}
                  whileHover={{ y: -10 }}
                  className="glass-panel p-10 rounded-[2.5rem] border border-white/5 text-center group"
                >
                  <div className={`w-16 h-16 bg-${card.color}-500/10 rounded-2xl mx-auto flex items-center justify-center mb-8 border border-${card.color}-500/20 group-hover:scale-110 transition-all`}>
                    <card.icon className={`w-8 h-8 text-${card.color}-400`} />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest text-[10px]">{card.label}</h3>
                  {card.link ? (
                    <a href={card.link} className="text-lg font-black text-white hover:text-emerald-400 transition-colors">
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-lg font-black text-white">{card.value}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
