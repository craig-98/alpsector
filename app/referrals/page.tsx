'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { referrals, user } from '@/lib/api';
import { ChevronLeft, Copy, Users, Link as LinkIcon, Gift, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Referral {
  id: string;
  referredUserId: string;
  hasInvested: boolean;
  bonusAmount: number;
  createdAt: string;
  referredUser: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ReferralsPage() {
  const router = useRouter();
  const [data, setData] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [refCode, setRefCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [refRes, userRes] = await Promise.all([
          referrals.getAll(),
          user.getProfile()
        ]);
        
        setData(refRes.data || []);
        
        // Find reference code from user profile
        const profile = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;
        if (profile?.referralCode) {
          setRefCode(profile.referralCode);
        } else if (profile?.id) {
          // Fallback to user ID if no specific code exists
          setRefCode(profile.id.substring(0, 8));
        }
      } catch (err) {
        console.error('Failed to load referrals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBonus = data.reduce((acc, ref) => acc + (ref.bonusAmount || 0), 0);
  const activeReferrals = data.filter(r => r.hasInvested).length;
  const refLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${refCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-hidden pb-20">
      <div className="fixed top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Affiliate Program</h1>
            <p className="text-brand-muted">Invite friends and earn lifetime commissions</p>
          </div>
        </div>

        {/* Affiliate Link Card */}
        <div className="glass-panel p-8 mb-12 bg-gradient-to-br from-brand-surface to-purple-900/10 border-purple-500/20 max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
            <Gift className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Share Your Unique Link</h2>
          <p className="text-brand-muted mb-8">Earn a percentage of every deposit your referrals make.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-brand-surface border border-white/10 p-2 rounded-xl">
            <div className="flex-1 overflow-x-hidden p-3 bg-black/20 rounded-lg flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-brand-muted shrink-0" />
              <span className="text-white font-mono text-sm truncate select-all">{refLink}</span>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition-all shrink-0 w-full sm:w-auto justify-center ${
                copied ? 'bg-emerald-500 text-slate-900' : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6">
            <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-2">Total Referrals</p>
            <h3 className="text-4xl font-black">{data.length}</h3>
          </div>
          <div className="glass-panel p-6">
            <p className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-2">Active Investors</p>
            <h3 className="text-4xl font-black text-emerald-400">{activeReferrals}</h3>
          </div>
          <div className="glass-panel p-6 bg-gradient-to-br from-brand-surface to-emerald-900/10 border-emerald-500/20">
            <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Total Earned</p>
            <h3 className="text-4xl font-black">${totalBonus.toLocaleString()}</h3>
          </div>
        </div>

        {/* List */}
        <div className="glass-panel p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Your Network
          </h3>
          
          {data.length === 0 ? (
            <div className="text-center p-12 text-brand-muted border-t border-white/5">
              <p>You haven't referred anyone yet.</p>
              <p className="text-sm mt-2">Share your link to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-4 text-xs font-bold text-brand-muted uppercase tracking-wider">User</th>
                    <th className="pb-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Joined Date</th>
                    <th className="pb-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                    <th className="pb-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Bonus Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map(ref => (
                    <tr key={ref.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold flex flex-col">
                        <span>{ref.referredUser?.firstName} {ref.referredUser?.lastName}</span>
                        <span className="text-xs text-brand-muted font-normal">{ref.referredUser?.email}</span>
                      </td>
                      <td className="py-4 text-sm text-brand-muted">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          ref.hasInvested ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-brand-surface border border-white/20 text-brand-muted'
                        }`}>
                          {ref.hasInvested ? 'Active Investor' : 'Registered'}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-emerald-400">
                        ${(ref.bonusAmount || 0).toLocaleString()}
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
