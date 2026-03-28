'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboard } from '@/lib/api';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Try to fetch dashboard data
    getDashboard()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        router.push('/login');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center p-8 relative z-10 glass-panel rounded-3xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-emerald-500 border-b-transparent border-l-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
}
