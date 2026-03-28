'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { transactions } from '@/lib/api';
import { ChevronLeft, ArrowDownRight, ArrowUpRight, ArrowRightLeft, CreditCard } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  method?: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'transfer'>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactions.getAll();
        setData(response.data || []);
      } catch (err) {
        console.error('Failed to load transactions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredData = filter === 'all' ? data : data.filter(t => t.type === filter);

  const getIcon = (type: string) => {
    if (type === 'deposit') return <ArrowDownRight className="w-5 h-5 text-emerald-400" />;
    if (type === 'withdrawal') return <ArrowUpRight className="w-5 h-5 text-red-400" />;
    return <ArrowRightLeft className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-hidden pb-20">
      <div className="fixed top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Financial History</h1>
              <p className="text-brand-muted">View all your deposits, withdrawals, and transfers</p>
            </div>
          </div>
          
          <div className="flex gap-2 bg-brand-surface p-1.5 rounded-2xl border border-white/5">
            {['all', 'deposit', 'withdrawal', 'transfer'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide capitalize transition-all ${filter === f ? 'bg-white/10 shadow-lg text-white' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-2">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center p-20 text-brand-muted">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found for the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold">Transaction</th>
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold">Amount</th>
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold">Date</th>
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredData.map(t => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 sm:p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            t.type === 'deposit' ? 'bg-emerald-500/10 border border-emerald-500/20' : 
                            t.type === 'withdrawal' ? 'bg-red-500/10 border border-red-500/20' : 
                            'bg-blue-500/10 border border-blue-500/20'
                          }`}>
                            {getIcon(t.type)}
                          </div>
                          <div>
                            <p className="font-bold capitalize">{t.type}</p>
                            <p className="text-xs text-brand-muted font-mono">{t.id.slice(0,8)}...{t.id.slice(-4)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6">
                        <p className={`font-black text-lg ${t.type === 'deposit' ? 'text-emerald-400' : t.type === 'withdrawal' ? 'text-red-400' : 'text-blue-400'}`}>
                          {t.type === 'withdrawal' ? '-' : '+'}${t.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="p-4 sm:p-6">
                        <p className="font-medium">{new Date(t.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-brand-muted">{new Date(t.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="p-4 sm:p-6 text-right">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          t.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 
                          t.status === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 
                          'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
