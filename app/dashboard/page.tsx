'use client'

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Bell, MessageCircle, Search, User, Settings, LogOut, DollarSign, TrendingUp, Activity, Wallet, Shield, BarChart3, Users, Globe, Headphones, Menu, ChevronDown } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import MobileBottomNav from '@/components/MobileBottomNav'
import ActivityTicker from "@/components/ActivityTicker"

// Light website theme matching tailwind.config.ts + layout
const theme = {
  wine50: '#fdf2f2',
  wine500: '#9c1b1e',
  wine600: '#8b0000',
  wine700: '#7a0f12',
  wine900: '#2d0a0c',

  'dark-grey': {
    50: '#f9fafb',
    100: '#f5f5f5',
    300: '#d1d5db',
    500: '#6b7280',
    700: '#374151',
    900: '#111827'
  },
  charcoal: '#0f0f23',
  gold: '#D4AF37',
  emerald: '#10B981',
  ruby: '#E0115F',
  slate: '#1e293b',
}

// Light glassmorphism matching website
const glass = "bg-white/80 backdrop-blur-xl border border-dark-grey-200 shadow-lg rounded-3xl overflow-hidden"
const glassHover = "hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1 hover:bg-white/90 transition-all duration-300 font-bold"


export default function Dashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  const [data, setData] = useState({
    portfolio: 125000,
    profit: 15600,
    roi: 12.5,
    activeInvestments: 8,
    availableBalance: 45000,
    pendingWithdrawals: 3200,
  })

  // Portfolio allocation for pie chart
  const allocationData = [
    { name: "Crypto", value: 42, color: theme.gold },
    { name: "Real Estate", value: 25, color: theme.emerald },
    { name: "Stocks", value: 18, color: theme.ruby },
    { name: "Commodities", value: 10, color: theme.wine600 },
    { name: "Bonds", value: 5, color: theme.slate },
  ]

  // Performance data
  const performanceData = [
    { date: "Jan", value: 400 },
    { date: "Feb", value: 450 },
    { date: "Mar", value: 480 },
    { date: "Apr", value: 550 },
    { date: "May", value: 600 },
  ]

  // Mock investments data
  const investments: {
    id: string
    plan: string
    amount: number
    roi: number
    progress: number
    status: "active" | "maturing"
  }[] = [
    { id: "#INV001", plan: "Premium Growth", amount: 5000, roi: 12.5, progress: 75, status: "active" },
    { id: "#INV002", plan: "Stable Income", amount: 3000, roi: 8.2, progress: 45, status: "active" },
    { id: "#INV003", plan: "Crypto Yield", amount: 8000, roi: 22.1, progress: 90, status: "maturing" },
    { id: "#INV004", plan: "Real Estate", amount: 12000, roi: 9.8, progress: 20, status: "active" },
    { id: "#INV005", plan: "High Risk", amount: 2500, roi: 35.7, progress: 60, status: "active" },
  ]

  const formSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().optional(),
    notifications: z.boolean(),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "John Doe",
      email: "john@example.com",
      notifications: true,
      password: "",
    },
  })

  const [open, setOpen] = useState(false)

  const onSubmit = (values: FormData) => {
    toast.success("Profile updated successfully!")
    setOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-grey-50 via-dark-grey-100 to-white text-black font-bold">


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${glass} bg-white/90 border-dark-grey-200 max-w-2xl mx-auto text-black font-bold`}>
          <DialogHeader>
            <DialogTitle className="font-bold text-black">Profile Settings</DialogTitle>
            <DialogDescription>Update your personal information, KYC, payments, and preferences.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-black">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline">
                    Upload Photo
                  </Button>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Leave blank to keep current" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-black">KYC Verification</h3>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                  <Button type="button" size="sm" variant="outline">
                    Upload Documents
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">Payment Methods</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>**** **** **** 4242 (Visa)</span>
                    <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
                  </div>
                  <Button type="button" variant="outline" className="w-full">
                    + Add Payment Method
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">Notification Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel>Email Notifications</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Receive email updates about investments and account activity.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col space-y-2">
                    <Label>Push Notifications</Label>
                    <Switch />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="pt-20 px-6 pb-12">
        {/* Quick Actions */}
        <motion.section 
          className="max-w-7xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: DollarSign, title: "Deposit", color: "emerald", bg: "from-emerald-500/20" },
              { icon: TrendingUp, title: "Invest Now", color: "gold", bg: "from-yellow-500/20", link: "/plans" },
              { icon: Wallet, title: "Withdraw", color: "ruby", bg: "from-pink-500/20" },
              { icon: Users, title: "Transfer", color: "wine", bg: "from-red-500/20" },
              { icon: BarChart3, title: "Portfolio", color: "slate", bg: "from-slate-500/20" },
            ].map((action, i) => (
              <motion.div
                key={action.title}
                className={`${glass} p-8 rounded-3xl text-center cursor-pointer group`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: `0 35px 60px -12px rgba(0,0,0,0.3)`, 
                  backgroundColor: `rgba(255,255,255,0.15)`
                }}
                onClick={action.link ? () => window.location.href = action.link : undefined}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${action.bg} border border-gray-400/30 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all`}>
                  <action.icon className="w-10 h-10 text-black drop-shadow-lg" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500 transition-colors">{action.title}</h3>
                <p className="text-sm uppercase tracking-wider">Quick Action</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Portfolio Overview */}
        <motion.section className="max-w-7xl mx-auto mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-16">
            <h1 className="text-6xl font-black bg-gradient-to-r from-black to-gray-800 bg-clip-text text-black mb-6 leading-tight">
              Portfolio Overview
            </h1>
            <p className="text-xl text-black font-bold max-w-2xl mx-auto">
              Monitor your global investment performance with institutional-grade analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Total Portfolio", value: 125000, change: 12.4, icon: DollarSign, color: "emerald" },
              { title: "Lifetime Profit", value: 15600, change: 18.2, icon: TrendingUp, color: "gold" },
              { title: "Active Investments", value: 8, change: 2.1, icon: Activity, color: "wine" },
              { title: "Available Balance", value: 45000, change: -0.5, icon: Wallet, color: "ruby" },
              { title: "Pending Withdrawals", value: 3200, change: 1.3, icon: Shield, color: "slate" },
              { title: "ROI", value: "12.5%", change: 3.7, icon: BarChart3, color: "emerald" },
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                className={`${glass} p-8 md:p-10`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 bg-gradient-to-r from-${metric.color}-500/20 to-${metric.color}-400/20 rounded-2xl border border-${metric.color}-400/30 shadow-lg`}>
                    <metric.icon className={`w-8 h-8 text-${metric.color}-400`} />
                  </div>
                  <Badge className={`text-xs font-bold px-4 py-2 rounded-full shadow-lg ${metric.change > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20'}`}>
                    {metric.change > 0 ? '↑' : '↓'} {metric.change}%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-black mb-3 capitalize tracking-tight">{metric.title}</h3>
                <div className="text-5xl font-black text-black mb-1">
                  {typeof metric.value === 'number' ? `$${metric.value.toLocaleString()}` : metric.value}
                </div>
                <p className="text-black text-sm uppercase tracking-wider font-bold">Institutional Grade</p>
              </motion.div>
            ))}
          </div>

          {/* Performance Chart */}
          <motion.div className={`${glass} p-8 rounded-3xl`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">Portfolio Performance</h3>
                <p className="text-black font-bold">Interactive chart with timeframe selector</p>
              </div>
              <Tabs defaultValue="monthly" className="w-full md:w-auto">
                <TabsList className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl p-1 space-x-1">
                  <TabsTrigger value="daily" className="data-[state=active]:bg-gold data-[state=active]:text-slate-900 rounded-xl px-4 py-2 font-medium">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="data-[state=active]:bg-gold data-[state=active]:text-slate-900 rounded-xl px-4 py-2 font-medium">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-gold data-[state=active]:text-slate-900 rounded-xl px-4 py-2 font-medium">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly" className="data-[state=active]:bg-gold data-[state=active]:text-slate-900 rounded-xl px-4 py-2 font-medium">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <defs>
                  <linearGradient id="performance" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={20} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tickMargin={20} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'rgba(15,15,35,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={3} dot={{ fill: "#D4AF37", strokeWidth: 2 }} activeDot={{ r: 8, strokeWidth: 3 }} />
                <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#performance)" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.section>

        {/* Asset Allocation */}
        <motion.section className="max-w-7xl mx-auto mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black bg-gradient-to-r from-black via-wine to-dark-grey-900 bg-clip-text text-black mb-6 font-bold">Asset Allocation</h2>
            <p className="text-xl text-black font-bold max-w-2xl mx-auto">Your portfolio diversification across asset classes</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Pie Chart */}
            <motion.div className={`${glass} p-8 rounded-3xl h-[400px] flex items-center justify-center`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart data={allocationData}>
                  <Pie dataKey="value" cx="50%" cy="50%" outerRadius={120} nameKey="name">
                    {allocationData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={3} stroke="rgba(255,255,255,0.2)" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
            {/* Allocation Table */}
            <motion.div className={`${glass} p-8 rounded-3xl`}>
              <h3 className="text-2xl font-bold text-black mb-8 text-left font-bold">Detailed Breakdown</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black font-bold">Asset Class</TableHead>
                    <TableHead className="text-black font-bold text-right">Allocation</TableHead>
                    <TableHead className="text-black font-bold text-right">Value</TableHead>
                    <TableHead className="text-black font-bold text-right">Risk Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocationData.map((asset: any) => (
                    <TableRow key={asset.name} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-black font-bold capitalize">{asset.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: asset.color }} />
                          <span className="text-gold font-bold">{asset.value.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-black">${((125000 * asset.value / 100)).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30 text-orange-400 font-bold">
                          Medium
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </motion.section>

        {/* Active Investments Table */}
        <motion.section className="max-w-7xl mx-auto mb-16 relative" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-black via-wine to-dark-grey-900 bg-clip-text text-black mb-2 font-bold">Active Investments</h2>
              <p className="text-xl text-black font-bold">Monitor your ongoing investment positions</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
              <Input placeholder="Search investments..." className={`${glass} rounded-2xl bg-white/5 border-white/10 text-white placeholder-slate-400`} />
              <Button className="bg-gradient-to-r from-wine to-ruby hover:from-ruby hover:to-wine text-gold font-bold px-8 py-6 rounded-2xl shadow-2xl hover:shadow-wine/20 transition-all">
                Invest Now
              </Button>
            </div>
          </div>

          <motion.div className={`${glass} rounded-3xl overflow-hidden shadow-2xl`}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="text-black font-bold w-20">ID</TableHead>
                  <TableHead className="text-black font-bold">Plan</TableHead>
                  <TableHead className="text-black font-bold text-right">Amount</TableHead>
                  <TableHead className="text-black font-bold text-right">ROI</TableHead>
                  <TableHead className="text-black font-bold">Progress</TableHead>
                  <TableHead className="text-black font-bold w-28">Status</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-mono text-sm text-black font-bold">{investment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald to-gold rounded-xl flex items-center justify-center shadow-lg">
                          <BarChart3 className="w-5 h-5 text-slate-900" />
                        </div>
                        <div>
                          <p className="font-bold text-black">{investment.plan}</p>
                          <p className="text-sm text-black font-bold">$12.5k invested</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald">
                      ${investment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-gradient-to-r from-emerald-500/20 to-gold/20 border-emerald-400/30 text-emerald-400 font-bold">
                        +{investment.roi}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={investment.progress} className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-gold [&>div]:shadow-lg" />
                      <p className="text-xs text-black font-bold text-right mt-1">{investment.progress}%</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={investment.status === "maturing" ? "default" : "secondary"} className={`font-bold ${investment.status === "maturing" ? "bg-gradient-to-r from-gold to-emerald text-slate-900 border-gold/30 shadow-gold/20" : "bg-white/10 text-slate-300 border-white/20"}`}>
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-9 w-9 rounded-xl hover:bg-white/10 p-0">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={`${glass} border-white/20 bg-slate-900 mt-1`}>
                          <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl cursor-pointer">Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl cursor-pointer">Withdraw</DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl cursor-pointer text-destructive">Close</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Floating Invest Button */}
          <motion.div 
            className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-40"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-emerald to-gold hover:from-gold hover:to-emerald text-slate-900 font-black px-12 py-8 rounded-3xl shadow-2xl hover:shadow-emerald/25 text-lg">
              <BarChart3 className="w-5 h-5 mr-2" />
              Invest Now
            </Button>
          </motion.div>
        </motion.section>

        <ActivityTicker />
      </main>


    </div>
  )
}

