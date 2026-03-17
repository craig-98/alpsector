'use client'

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { 
  BarChart3, DollarSign, TrendingUp, Activity, Shield, Users, Wallet, Bell, MessageCircle, Search, Menu, 
  PieChart, TrendingUpDown as LineChartIcon, Download, Key, Link2, Globe, Headphones, Megaphone 
} from "lucide-react"
import { getDashboard } from "@/lib/api"
import ActivityTicker from "@/components/ActivityTicker"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Cell,
  Legend,
} from "recharts"


// Mock Data (replace with API)
const mockUser = {
  firstName: "John",
  balance: 12500,
  invested: 45000,
  withdrawn: 3200,
  roi: 12.4,
  activeInvestments: 5,
  pendingWithdrawals: 2,
}

const portfolioData = [
  { name: "Crypto", value: 45, color: "#F59E0B", risk: 93 },
  { name: "Real Estate", value: 20, color: "#EF4444", risk: 78 },
  { name: "Stocks", value: 15, color: "#3B82F6", risk: 85 },
  { name: "Commodities", value: 10, color: "#10B981", risk: 72 },
  { name: "Agriculture", value: 7, color: "#8B5CF6", risk: 63 },
  { name: "Bonds", value: 3, color: "#6B7280", risk: 68 },
]

const chartData = [
  { month: "Jan", earnings: 1200 },
  { month: "Feb", earnings: 1800 },
  { month: "Mar", earnings: 1500 },
  { month: "Apr", earnings: 2200 },
  { month: "May", earnings: 1900 },
]

const investments = [
  { id: "#INV001", plan: "Premium Growth", amount: 5000, start: "2024-01-15", maturity: "2024-07-15", profit: 450, status: "active" },
  { id: "#INV002", plan: "Stable Income", amount: 3000, start: "2024-02-01", maturity: "2024-04-01", profit: 180, status: "completed" },
]

const transactions = [
  { id: "#TX001", type: "deposit", amount: 5000, date: "2024-05-10", status: "completed" },
  { id: "#TX002", type: "profit", amount: 450, date: "2024-05-15", status: "completed" },
  { id: "#TX003", type: "withdrawal", amount: -1200, date: "2024-05-20", status: "pending" },
]

const notifications = [
  { id: 1, title: "Investment #INV001 matured", type: "success", unread: true },
  { id: 2, title: "Deposit confirmed", type: "info", unread: false },
]

const useCountUp = (value: number) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 2000
    const stepTime = 20
    const steps = duration / stepTime
    const increment = value / steps
    let timer: NodeJS.Timeout
    timer = setInterval(() => {
      start += increment
      setCount(start)
      if (start >= value) clearInterval(timer)
    }, stepTime)
    return () => clearInterval(timer)
  }, [value])
  return Math.floor(count).toLocaleString()
}

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, change = 0, color = "emerald" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
className="group relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-2xl backdrop-blur-sm border border-amber-400/30">
        <Icon className="w-6 h-6 text-amber-400" />
      </div>
      <Badge className={`text-xs font-bold ${change >= 0 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
        {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
      </Badge>
    </div>
  <h3 className="text-2xl font-semibold text-black mb-1">{title}</h3>
    <div className="text-4xl font-black text-slate-900">
      ${useCountUp(value)}
    </div>
  </motion.div>
)

export default function Dashboard() {
  const [user, setUser] = useState(mockUser)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [timePeriod, setTimePeriod] = useState("monthly")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboard()
        setUser(data)
      } catch {
        // Mock fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
  <div className="min-h-screen bg-slate-50 p-8 space-y-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-grey-50">
      {/* Header nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-grey-100/95 backdrop-blur-md border-b border-dark-grey-300 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/images/alpsectorlogo.PNG" alt="Alpsector Logo" className="w-12 h-12 rounded-xl shadow-lg object-contain" />
              <span className="text-xl font-black text-black tracking-tight">
                Alpsector Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <a href="/" className="text-black hover:text-wine-600 font-bold transition-colors">Home</a>
              <a href="/plans" className="text-black hover:text-wine-600 font-bold transition-colors">Plans</a>
              <Button className="bg-wine-600 hover:bg-wine-700 text-white px-6 py-2.5 font-bold rounded-lg shadow-lg hover:shadow-wine-500/50 transition-all duration-200">
                Invest Now
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-14 p-8 max-w-7xl mx-auto space-y-12">
        {/* Metric Cards */}
        <section>
<h2 className="text-4xl font-black text-black mb-8">Portfolio Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <MetricCard title="Total Portfolio Value" value={user.balance + user.invested} change={12.4} icon={DollarSign} />
            <MetricCard title="Total Profit" value={user.balance * 0.15} change={18.2} color="emerald" icon={TrendingUp} />
            <MetricCard title="Active Investments" value={user.activeInvestments} change={2.1} icon={Activity} />
            <MetricCard title="Available Balance" value={user.balance} change={-0.5} icon={Wallet} />
            <MetricCard title="Pending Withdrawals" value={user.pendingWithdrawals} change={1.3} icon={Shield} />
            <MetricCard title="ROI" value={user.roi} change={3.7} icon={BarChart3} />
          </div>
        </section>

        {/* Charts & Tables - Adapt to light theme */}
        {/* ... (keep your existing content, replace dark classes with light equivalents) */}
        <ActivityTicker />
      </main>
    </div>
  )
}


