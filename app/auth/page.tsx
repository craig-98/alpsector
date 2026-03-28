'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your identity cryptographic signature...');
  const [countdown, setCountdown] = useState(5);

  const token = searchParams?.get('verify') || '';
  const isVerifying = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or tampered verification link.');
      return;
    }

    if (isVerifying.current) return;
    isVerifying.current = true;

    const verifyAccount = async () => {
      try {
        await auth.verify(token);
        setStatus('success');
        setMessage('Your email has been securely verified.');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Cryptographic verification failed';
        // If it's literally just the duplicate request hitting "Account Already Verified".
        if (errorMessage.includes("Account Already Verified") || errorMessage.includes("already verified")) {
           setStatus('success');
           setMessage('Your email has been securely verified.');
           return;
        }
        setStatus('error');
        setMessage(errorMessage);
      }
    };

    verifyAccount();
  }, [token]);

  // Countdown timer for auto-redirect on success
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'success') {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, router]);

  return (
    <div className="w-full max-w-lg relative z-10 my-8 flex flex-col items-center">
      <Link href="/" className="inline-block mb-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
          <img src="/alpsectorlogo.PNG" alt="Alpsector Logo" className="w-16 h-16 relative bg-brand-surface rounded-xl shadow-2xl object-contain ring-1 ring-white/10" />
        </div>
      </Link>

      <div className="glass-panel w-full p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Magic glows based on status */}
        {status === 'loading' && <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20 animate-pulse pointer-events-none" />}
        {status === 'success' && <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-3xl opacity-20 pointer-events-none" />}
        {status === 'error' && <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 blur-3xl opacity-20 pointer-events-none" />}

        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-8 relative flex items-center justify-center">
              <svg className="animate-spin absolute w-full h-full text-blue-500/20" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="w-10 h-10 bg-blue-500/20 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Authenticating Data</h2>
            <p className="text-brand-muted font-medium">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/50">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Verification Complete</h2>
            <p className="text-brand-muted mb-8 text-lg font-medium">
              {message} <br/><br/>
              Next step: Sign in to complete your mandatory <span className="text-emerald-400 font-bold">KYC compliance verification</span>.
            </p>
            
            <Link 
              href="/login"
              className="inline-flex w-full items-center justify-center bg-white text-black font-black text-lg px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-xl"
            >
              Sign In to Complete KYC
            </Link>
            
            <p className="text-sm font-semibold text-brand-muted mt-6">
              Auto-redirecting in {countdown}s...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
             <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.3)] border border-red-500/50">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Verification Failed</h2>
            <p className="text-brand-muted mb-8 text-lg font-medium">{message}</p>
            
            <div className="flex flex-col gap-4 w-full">
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex w-full items-center justify-center bg-brand-surface border border-white/10 text-white font-black text-lg px-8 py-4 rounded-xl hover:bg-white/5 transition-colors shadow-glass"
              >
                Retry
              </button>
              <Link 
                href="/login"
                className="inline-flex w-full items-center justify-center bg-transparent border-none text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-brand-dark py-12 px-4">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="w-full max-w-lg z-10 glass-panel p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
