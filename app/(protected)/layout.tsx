import { redirect } from 'next/navigation';
import { getDashboard } from '@/lib/api';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token) {
    redirect('/login');
  }

  try {
    await getDashboard();
  } catch {
    localStorage.removeItem('token');
    redirect('/login');
  }

  return (
    <div>
      {children}
    </div>
  );
}
