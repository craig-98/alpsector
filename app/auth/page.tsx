'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');

  const token = searchParams?.get('verify') || '';

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyAccount = async () => {
      try {
        await auth.verify(token);
        setStatus('success');
        setMessage('Account verified successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Verification failed';
        setStatus('error');
        setMessage(errorMessage);
      }
    };

    verifyAccount();
  }, [token, router]);

  return (
    <Card className="w-full max-w-md shadow-2xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {status === 'loading' && 'Verifying...'}
          {status === 'success' && '✓ Success'}
          {status === 'error' && '❌ Error'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className={`${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
          {message}
        </p>
        {status === 'error' && (
          <button
            onClick={() => router.push('/login')}
            className="mt-4 text-emerald-600 hover:underline"
          >
            Go to Login
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <Suspense fallback={
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          </CardHeader>
        </Card>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
