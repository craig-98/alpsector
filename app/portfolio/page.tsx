'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { investments } from '@/lib/api';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Activity, ChevronLeft, Calendar } from 'lucide-react';

interface Investment {
  id: string;
  plan: string;
  amount: number;
  percentageProfit: number;
  progress: number;
  status: 'active' | 'completed' | 'maturing';
  createdAt: string;
}

export default function PortfolioPage() {
  const router = useRouter();
  const [data, setData] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await investments.getAll();
        setData(response.data || []);
      } catch (err) {
        console.error('Failed to load portfolio', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const totalInvested = data.reduce((acc, inv) => acc + inv.amount, 0);
  const activeCount = data.filter(i => i.status === 'active').length;
  
  // Dummy chart data for visual aesthetics
  const chartData = [
    { name: 'Jan', value: totalInvested * 0.8 },
    { name: 'Feb', value: totalInvested * 0.9 },
    { name: 'Mar', value: totalInvested * 0.95 },
    { name: 'Apr', value: totalInvested },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-hidden pb-20">
      <div className="fixed top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Investment Portfolio</h1>
            <p className="text-brand-muted">Detailed view of your active holdings and performance</p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-brand-muted font-bold uppercase tracking-wider text-sm">Total Invested</p>
            </div>
            <h2 className="text-4xl font-black">${totalInvested.toLocaleString()}</h2>
          </div>

          <div className="glass-panel p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-brand-muted font-bold uppercase tracking-wider text-sm">Active Plans</p>
            </div>
            <h2 className="text-4xl font-black">{activeCount}</h2>
          </div>

          <div className="glass-panel p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-brand-muted font-bold uppercase tracking-wider text-sm">Avg Return</p>
            </div>
            <h2 className="text-4xl font-black">+{data.length ? (data.reduce((a,b)=>a+b.percentageProfit,0)/data.length).toFixed(1) : 0}%</h2>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="glass-panel p-8 mb-12 h-[400px]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" /> 
            Value Over Time
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#3f3f46" tick={{fill: '#a1a1aa'}} />
              <YAxis stroke="#3f3f46" tick={{fill: '#a1a1aa'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', borderRadius: '12px' }}
                itemStyle={{ color: '#10B981' }}
              />
              <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Investments List */}
        <h3 className="text-2xl font-black mb-6">Investment History</h3>
        <div className="space-y-4">
          {data.length === 0 ? (
            <div className="glass-panel p-12 text-center text-brand-muted">
              No investments found. Go to the Plans page to start investing.
            </div>
          ) : (
            data.map((inv) => (
              <div key={inv.id} className="glass-panel-hover p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-white/5 flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{inv.plan}</h4>
                    <p className="text-sm text-brand-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> 
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:text-center w-full md:w-auto">
                  <div>
                    <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Amount</p>
                    <p className="font-bold text-lg">${inv.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Profit</p>
                    <p className="font-bold text-lg text-emerald-400">+{inv.percentageProfit}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden w-24">
                        <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{width: `${inv.progress}%`}} />
                      </div>
                      <span className="font-bold text-sm">{inv.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inv.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 
                      inv.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 
                      'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
