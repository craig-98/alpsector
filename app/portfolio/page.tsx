'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Wallet, 
  BarChart3, 
  PieChart,
  ArrowUpRight,
  RefreshCw,
  Bitcoin,
  Building2,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MobileBottomNav from '@/components/MobileBottomNav';
import { investments as investmentsApi, wallet as walletApi } from '@/lib/api';

interface Investment {
  id: string;
  assetId: string;
  assetName: string;
  amount: number;
  roi: number;
  profit: number;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  assetType: string;
}

interface WalletData {
  balance: number;
  bonusBalance: number;
  totalProfit: number;
  totalDeposited: number;
  totalWithdrawn: number;
}

export default function PortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [investmentsData, walletData] = await Promise.all([
        investmentsApi.getAll(),
        walletApi.get()
      ]);

      setInvestments(Array.isArray(investmentsData) ? investmentsData : []);
      setWalletData(Array.isArray(walletData) ? walletData[0] : walletData);
    } catch (err: any) {
      console.error('Failed to fetch portfolio:', err);
      setError(err.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = investments.reduce((sum, inv) => sum + inv.profit, 0);
  const activeCount = investments.filter(inv => inv.status === 'active').length;
  const maturingCount = investments.filter(inv => inv.status === 'maturing').length;

  const assetAllocation = investments.reduce((acc, inv) => {
    const type = inv.assetType || 'Other';
    if (!acc[type]) {
      acc[type] = { amount: 0, count: 0 };
    }
    acc[type].amount += inv.amount;
    acc[type].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  const allocationData = Object.entries(assetAllocation).map(([name, data]) => ({
    name,
    value: data.amount,
    count: data.count,
    percentage: totalInvested > 0 ? (data.amount / totalInvested * 100) : 0
  }));

  const getAssetIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('crypto') || lowerType.includes('bitcoin')) return Bitcoin;
    if (lowerType.includes('real') || lowerType.includes('estate')) return Building2;
    if (lowerType.includes('commod')) return Package;
    if (lowerType.includes('stock') || lowerType.includes('etf')) return TrendingUp;
    return BarChart3;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-grey-50 via-dark-grey-100 to-white text-black font-bold pb-24">
      <header className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-black mb-2">Portfolio</h1>
              <p className="text-gray-600">Track your investment performance</p>
            </div>
            <Button variant="outline" onClick={fetchData} className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div className="bg-white rounded-3xl p-6 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-gray-500 text-sm mb-1">Total Invested</p>
              <p className="text-2xl font-black text-black">${totalInvested.toLocaleString()}</p>
            </motion.div>

            <motion.div className="bg-white rounded-3xl p-6 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gold/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-gray-500 text-sm mb-1">Total Profit</p>
              <p className="text-2xl font-black text-black">${totalProfit.toLocaleString()}</p>
            </motion.div>

            <motion.div className="bg-white rounded-3xl p-6 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">Active Investments</p>
              <p className="text-2xl font-black text-black">{activeCount}</p>
            </motion.div>

            <motion.div className="bg-white rounded-3xl p-6 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">Wallet Balance</p>
              <p className="text-2xl font-black text-black">${(walletData?.balance || 0).toLocaleString()}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div className="bg-white rounded-3xl p-8 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="text-2xl font-bold text-black mb-6">Asset Allocation</h2>
              {allocationData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No investments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allocationData.map((asset) => {
                    const Icon = getAssetIcon(asset.name);
                    return (
                      <div key={asset.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-gold rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-black">{asset.name}</p>
                            <p className="text-sm text-gray-500">{asset.count} investment{asset.count !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-black">${asset.value.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{asset.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div className="bg-white rounded-3xl p-8 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h2 className="text-2xl font-bold text-black mb-6">Performance Overview</h2>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-gold/10 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Total ROI</span>
                    <span className="text-emerald-600 font-bold">+{totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <Progress value={totalInvested > 0 ? Math.min((totalProfit / totalInvested) * 100, 100) : 0} className="h-2 bg-gray-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">Active</p>
                    <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">Maturing</p>
                    <p className="text-2xl font-black text-yellow-600">{maturingCount}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div className="bg-white rounded-3xl p-8 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">All Investments</h2>
              <Button onClick={() => router.push('/plans')} className="bg-gradient-to-r from-emerald-500 to-gold text-white">
                New Investment
              </Button>
            </div>

            {investments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No investments found</p>
                <Button onClick={() => router.push('/plans')} variant="outline">
                  Start Investing
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black font-bold">Asset</TableHead>
                    <TableHead className="text-black font-bold text-right">Amount</TableHead>
                    <TableHead className="text-black font-bold text-right">ROI</TableHead>
                    <TableHead className="text-black font-bold">Progress</TableHead>
                    <TableHead className="text-black font-bold">Status</TableHead>
                    <TableHead className="text-black font-bold">Returns</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((inv) => {
                    const Icon = getAssetIcon(inv.assetType);
                    return (
                      <TableRow key={inv.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-gold rounded-xl flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-black">{inv.assetName || inv.assetType}</p>
                              <p className="text-sm text-gray-500">{inv.assetType}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-black">
                          ${inv.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-emerald-100 text-emerald-700">+{inv.roi}%</Badge>
                        </TableCell>
                        <TableCell className="w-40">
                          <Progress value={inv.progress} className="h-2 bg-gray-100" />
                          <p className="text-xs text-gray-500 mt-1">{inv.progress}%</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={inv.status === 'active' ? 'bg-emerald-100 text-emerald-700' : inv.status === 'maturing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-emerald-600 font-bold">
                          +${inv.profit.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-xl">Details</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Withdraw</DropdownMenuItem>
                              <DropdownMenuItem>Renew</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </motion.div>
        </div>
      </main>

      <MobileBottomNav active="portfolio" />
    </div>
  );
}
