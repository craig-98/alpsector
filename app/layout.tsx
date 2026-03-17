import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Alpinvest Securities - Invest in the Future",
  description: "Secure automated investment platform with daily returns. Crypto, stocks, ETFs.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* Top Nav Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-grey-100/95 backdrop-blur-md border-b border-dark-grey-300 py-2 sm:py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img src="/alpsectorlogo.PNG" alt="Alpsector Logo" className="w-12 sm:w-16 h-12 sm:h-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl object-contain ring-4 ring-slate-200/50 border border-white/50" />
                <span className="text-lg sm:text-xl font-black text-black tracking-tight">
                  Alpsector
                </span>
              </div>

              {/* Nav Links */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">Home</a>
                <a href="/plans" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">Plans</a>
                <a href="/dashboard" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">Dashboard</a>
                <a href="/about" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">About</a>
                <a href="/faq" className="text-black hover:text-wine-600 font-bold transition-colors text-sm sm:text-base">FAQ</a>
              </div>

              {/* CTA */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <a href="/login" className="text-black hover:text-wine-600 px-3 sm:px-4 py-2 font-bold transition-colors rounded-lg hover:bg-dark-grey-200 text-sm">Login</a>
                <a href="/register" className="bg-white/80 backdrop-blur-xl hover:bg-white/90 text-black px-4 sm:px-6 py-2.5 font-bold rounded-lg shadow-lg hover:shadow-slate-900/20 border border-white/50 transition-all duration-200 min-h-[44px]">
                  Get Started
                </a>
              </div>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <button 
                    className="md:hidden p-2 font-bold text-xl rounded-2xl hover:bg-dark-grey-200 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center text-black hover:scale-110" 
                  >
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
                      <Link href="/login" className="block w-full text-center py-3 bg-black text-white font-bold rounded-xl hover:bg-dark-grey-900 transition-all mb-3">Login</Link>
                      <Link href="/register" className="block w-full text-center py-3 bg-white text-black font-bold rounded-xl shadow-lg border border-dark-grey-200 hover:shadow-xl transition-all">Get Started</Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        <main className="pt-12 sm:pt-14 min-h-screen bg-dark-grey-50">
          {children}
        </main>
      </body>
    </html>
  )
}
