"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setIsLoggedIn(!!newToken);
    };
    window.addEventListener("storage", handleStorageChange);

    const handleLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("user-logged-in", handleLogin);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-logged-in", handleLogin);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-brand-dark border-b border-brand-border"></nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-dark/70 backdrop-blur-2xl border-b border-white/[0.05] shadow-glass py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <img
                src="/alpsectorlogo.PNG"
                alt="Alpsector Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 relative bg-brand-surface rounded-xl shadow-2xl object-contain ring-1 ring-white/10"
              />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Alpsector
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8 bg-brand-surface/50 px-6 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
            <Link
              href="/"
              className="text-brand-muted hover:text-white font-medium transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              href="/plans"
              className="text-brand-muted hover:text-white font-medium transition-colors text-sm"
            >
              Plans
            </Link>
            <Link
              href="/dashboard"
              className="text-brand-muted hover:text-white font-medium transition-colors text-sm"
            >
              Dashboard
            </Link>
            {isLoggedIn && (
              <Link
                href="/wallet"
                className="text-brand-muted hover:text-white font-medium transition-colors text-sm"
              >
                Wallet
              </Link>
            )}
            <Link
              href="/about"
              className="text-brand-muted hover:text-white font-medium transition-colors text-sm"
            >
              About
            </Link>
            <Link
              href="/faq"
              className="text-brand-muted hover:text-white font-medium transition-colors text-sm"
            >
              FAQ
            </Link>
          </div>

          {/* CTA - Show based on login status */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="text-brand-muted hover:text-white px-4 py-2 font-medium transition-colors rounded-lg hover:bg-white/5 text-sm"
              >
                Logout
              </button>
              <Link href="/dashboard" className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-brand-dark px-6 py-2.5 rounded-lg flex items-center justify-center font-bold text-white text-sm transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:bg-brand-surface">
                  My Account
                </div>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-brand-muted hover:text-white px-4 py-2 font-medium transition-colors rounded-lg hover:bg-white/5 text-sm"
              >
                Sign In
              </Link>
              <Link href="/register" className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 rounded-lg flex items-center justify-center font-bold text-white text-sm transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                  Get Started
                </div>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-brand-muted hover:text-white transition-colors rounded-lg hover:bg-white/5 relative z-50">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-brand-dark/95 backdrop-blur-2xl border-l border-white/5 p-8 w-[320px] sm:w-[400px]"
            >
              <nav className="space-y-4 mt-12 flex flex-col">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 px-4 text-lg font-medium text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  Home
                </Link>
                <Link
                  href="/plans"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 px-4 text-lg font-medium text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  Plans
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 px-4 text-lg font-medium text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  Dashboard
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/wallet"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-4 px-4 text-lg font-medium text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    Wallet
                  </Link>
                )}
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 px-4 text-lg font-medium text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  About
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 px-4 text-lg font-medium text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  FAQ
                </Link>

                <div className="pt-8 mt-4 border-t border-white/10 flex flex-col gap-4">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center py-4 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-center py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
