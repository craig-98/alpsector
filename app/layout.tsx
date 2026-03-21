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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="pt-12 sm:pt-14 min-h-screen bg-dark-grey-50">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
