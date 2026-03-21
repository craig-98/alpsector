'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Listen for storage changes (e.g., when user logs in from another tab/page)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setIsLoggedIn(!!newToken);
    };
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event when user logs in within the same page
    const handleLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    window.addEventListener('user-logged-in', handleLogin);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-logged-in', handleLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-grey-100/95 backdrop-blur-md border-b border-dark-grey-300 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src="/alpsectorlogo.PNG" alt="Alpsector Logo" className="w-12 sm:w-16 h-12 sm:h-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl object-contain ring-4 ring-slate-200/50 border border-white/50" />
              <span className="text-lg sm:text-xl font-black text-black tracking-tight">Alpsector</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-grey-100/95 backdrop-blur-md border-b border-dark-grey-300 py-2 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src="/alpsectorlogo.PNG" alt="Alpsector Logo" className="w-12 sm:w-16 h-12 sm:h-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl object-contain ring-4 ring-slate-200/50 border border-white/50" />
            <span className="text-lg sm:text-xl font-black text-black tracking-tight">Alpsector</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">Home</Link>
            <Link href="/plans" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">Plans</Link>
            <Link href="/dashboard" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">Dashboard</Link>
            <Link href="/about" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">About</Link>
            <Link href="/faq" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">FAQ</Link>
          </div>

          {/* CTA - Show based on login status */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link href="/dashboard" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2.5 font-bold rounded-lg shadow-lg transition-all duration-200 min-h-[44px]">
                My Account
              </Link>
              <button 
                onClick={handleLogout}
                className="text-black hover:text-wine-600 px-3 sm:px-4 py-2 font-bold transition-colors rounded-lg hover:bg-dark-grey-200 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link href="/login" className="text-black hover:text-wine-600 px-3 sm:px-4 py-2 font-bold transition-colors rounded-lg hover:bg-dark-grey-200 text-sm">Login</Link>
              <Link href="/register" className="bg-white/80 backdrop-blur-xl hover:bg-white/90 text-black px-4 sm:px-6 py-2.5 font-bold rounded-lg shadow-lg hover:shadow-slate-900/20 border border-white/50 transition-all duration-200 min-h-[44px]">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 font-bold text-xl rounded-2xl hover:bg-dark-grey-200 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center text-black hover:scale-110">
                <Menu className="w-8 h-8" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/90 backdrop-blur-xl border-dark-grey-200 p-8 w-[320px]">
              <nav className="space-y-6 mt-8">
                <Link href="/" className="block py-3 px-4 text-lg font-bold hover:bg-dark-grey-100 rounded-xl transition-all">Home</Link>
                <Link href="/plans" className="block py-3 px-4 text-lg font-bold hover:bg-dark-grey-100 rounded-xl transition-all">Plans</Link>
                <Link href="/dashboard" className="block py-3 px-4 text-lg font-bold hover:bg-dark-grey-100 rounded-xl transition-all">Dashboard</Link>
                <Link href="/about" className="block py-3 px-4 text-lg font-bold hover:bg-dark-grey-100 rounded-xl transition-all">About</Link>
                <Link href="/faq" className="block py-3 px-4 text-lg font-bold hover:bg-dark-grey-100 rounded-xl transition-all">FAQ</Link>
                <div className="pt-8 border-t border-dark-grey-200">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" className="block w-full text-center py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all mb-3">My Account</Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-center py-3 bg-black text-white font-bold rounded-xl hover:bg-dark-grey-900 transition-all"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block w-full text-center py-3 bg-black text-white font-bold rounded-xl hover:bg-dark-grey-900 transition-all mb-3">Login</Link>
                      <Link href="/register" className="block w-full text-center py-3 bg-white text-black font-bold rounded-xl shadow-lg border border-dark-grey-200 hover:shadow-xl transition-all">Get Started</Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
