import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alpinvest Securities - Invest in the Future",
  description:
    "Secure automated investment platform with daily returns. Crypto, stocks, ETFs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} min-h-screen bg-brand-dark text-brand-text antialiased selection:bg-emerald-500/30 selection:text-emerald-200`}>
        {/* Subtle mesh gradient background overlay */}
        <div className="fixed inset-0 bg-mesh-dark mix-blend-screen pointer-events-none opacity-40 z-[-1]" />
        
        <Header />
        <main className="pt-16 sm:pt-20 min-h-screen relative z-0 flex flex-col">
          {children}
        </main>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
