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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-dark-grey-200 shadow-2xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-evenly">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`
              p-3 rounded-2xl flex flex-col items-center gap-1 transition-all duration-200 group
              ${active === tab.key 
                ? 'bg-gradient-to-r from-wine-500 to-black text-white shadow-2xl shadow-wine-500/25 scale-105' 
                : 'text-dark-grey-700 hover:text-black hover:scale-110 hover:bg-dark-grey-100'
              }
            `}
          >
            <tab.icon className={`w-6 h-6 group-hover:scale-110 ${active === tab.key ? 'drop-shadow-lg' : ''}`} />
            <span className="text-xs font-bold uppercase tracking-wide">{tab.label}</span>
          </Link>
        ))}
      </nav>
    </motion.div>
  )
}

