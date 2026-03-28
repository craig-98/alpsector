'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutDashboard, Wallet, User, BarChart3, MessageCircle, Bell } from "lucide-react"

interface MobileBottomNavProps {
  active: string
}

export default function MobileBottomNav({ active }: MobileBottomNavProps) {
  const tabs = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
    { href: '/portfolio', icon: BarChart3, label: 'Portfolio', key: 'portfolio' },
    { href: '/wallet', icon: Wallet, label: 'Wallet', key: 'wallet' },
    { href: '/profile', icon: User, label: 'Profile', key: 'profile' },
    { href: '/messages', icon: MessageCircle, label: 'Messages', key: 'messages' },
    { href: '/notifications', icon: Bell, label: 'Notifications', key: 'notifications' },
  ]

  return (
    <motion.div
      className="md:hidden fixed bottom-6 left-4 right-4 z-50 bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden shadow-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-evenly">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`
              p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all duration-300 group
              ${active === tab.key 
                ? 'bg-emerald-500/20 text-emerald-400 shadow-lg border border-emerald-500/20' 
                : 'text-brand-muted hover:text-white hover:bg-white/5 border border-transparent'
              }
            `}
          >
            <tab.icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${active === tab.key ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </Link>
        ))}
      </nav>
    </motion.div>
  )
}

