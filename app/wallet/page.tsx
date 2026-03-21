"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wallet,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  RefreshCw,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import MobileBottomNav from "@/components/MobileBottomNav";
import { transactions, wallet } from "@/lib/api";

interface WalletData {
  id: string;
  balance: number;
  bonusBalance: number;
  totalProfit: number;
  totalDeposited: number;
  totalWithdrawn: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  method?: string;
  createdAt: string;
  description?: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("crypto");
  const [depositCrypto, setDepositCrypto] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("");
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const [walletResponse, transactionsData] = await Promise.all([
        wallet.get().catch(() => null),
        transactions.getAll(),
      ]);

      setWalletData(walletResponse);
      setTransactionsList(transactionsData || []);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [router]);

  const handleDeposit = async () => {
    try {
      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (depositMethod === "crypto") {
        if (!depositCrypto || !depositAddress) {
          toast.error("Please fill in cryptocurrency and wallet address");
          return;
        }
      }
      await transactions.deposit(parseFloat(depositAmount), depositMethod, undefined, depositCrypto, depositAddress);
      toast.success("Deposit request submitted!");
      setShowDeposit(false);
      setDepositAmount("");
      setDepositCrypto("");
      setDepositAddress("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit deposit");
    }
  };

  const handleWithdraw = async () => {
    try {
      if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (parseFloat(withdrawAmount) > (walletData?.balance || 0)) {
        toast.error("Insufficient balance");
        return;
      }
      if (!withdrawBank || !withdrawAccountNumber) {
        toast.error("Please fill in all bank details");
        return;
      }
      await transactions.withdraw({
        amount: parseFloat(withdrawAmount),
        bankCode: withdrawBank,
        accountNumber: withdrawAccountNumber,
        accountName: "", // Optional or could add a field
      });
      toast.success("Withdrawal request submitted!");
      setShowWithdraw(false);
      setWithdrawAmount("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit withdrawal");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading wallet...</p>
        </div>
      </div>
    );
  }

  const balance = walletData?.balance || 0;
  const bonusBalance = walletData?.bonusBalance || 0;
  const totalDeposited = walletData?.totalDeposited || 0;
  const totalWithdrawn = walletData?.totalWithdrawn || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-grey-50 via-dark-grey-100 to-white text-black font-bold pb-24">
      <header className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-black mb-2">Wallet</h1>
              <p className="text-gray-600">Manage your funds</p>
            </div>
            <Button
              variant="outline"
              onClick={fetchData}
              className="rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-emerald-600 to-yellow-500 rounded-3xl p-8 text-white mb-8 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="opacity-80 mb-2">Total Balance</p>
            <p className="text-5xl font-black mb-6">
              ${balance.toLocaleString()}
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowDeposit(true)}
                className="bg-white text-emerald-700 hover:bg-white/90 font-bold"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button
                onClick={() => setShowWithdraw(true)}
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-bold"
              >
                <ArrowDownRight className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-gray-600">Total Deposited</span>
              </div>
              <p className="text-2xl font-black text-black">
                ${totalDeposited.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-600">Total Withdrawn</span>
              </div>
              <p className="text-2xl font-black text-black">
                ${totalWithdrawn.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-gray-600">Bonus Balance</span>
              </div>
              <p className="text-2xl font-black text-black">
                ${bonusBalance.toLocaleString()}
              </p>
            </motion.div>
          </div>

          {showDeposit && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-black mb-4">
                  Deposit Funds
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                      value={depositMethod}
                      disabled
                    >
                      <option value="crypto">Cryptocurrency</option>
                    </select>
                  </div>
                  {depositMethod === "crypto" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cryptocurrency
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-xl"
                          value={depositCrypto}
                          onChange={(e) => setDepositCrypto(e.target.value)}
                        >
                          <option value="">Select cryptocurrency</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="USDT">Tether (USDT)</option>
                          <option value="USDC">USD Coin (USDC)</option>
                          <option value="BNB">Binance Coin (BNB)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Wallet Address
                        </label>
                        <input
                          type="text"
                          value={depositAddress}
                          onChange={(e) => setDepositAddress(e.target.value)}
                          placeholder="Enter your wallet address"
                          className="w-full p-3 border border-gray-300 rounded-xl"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeposit(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeposit}
                    className="flex-1 bg-emerald-600"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showWithdraw && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-black mb-4">
                  Withdraw Funds
                </h2>
                <div className="p-4 bg-emerald-50 rounded-xl mb-4">
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-black text-emerald-600">
                    ${balance.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full p-3 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank
                    </label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-xl"
                      value={withdrawBank}
                      onChange={(e) => setWithdrawBank(e.target.value)}
                    >
                      <option value="">Select bank</option>
                      <option value="access">Access Bank</option>
                      <option value="gtb">GT Bank</option>
                      <option value="zenith">Zenith Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="Account number"
                      className="w-full p-3 border border-gray-300 rounded-xl"
                      value={withdrawAccountNumber}
                      onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowWithdraw(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleWithdraw}
                    className="flex-1 bg-emerald-600"
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>
          )}

          <motion.div
            className="bg-white rounded-3xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-black mb-6">
              Transaction History
            </h2>

            {transactionsList.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black font-bold">Type</TableHead>
                    <TableHead className="text-black font-bold">
                      Description
                    </TableHead>
                    <TableHead className="text-black font-bold text-right">
                      Amount
                    </TableHead>
                    <TableHead className="text-black font-bold">
                      Status
                    </TableHead>
                    <TableHead className="text-black font-bold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsList.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.type === "deposit" && (
                            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                          )}
                          {tx.type === "withdrawal" && (
                            <ArrowDownRight className="w-5 h-5 text-red-500" />
                          )}
                          {tx.type === "investment" && (
                            <CreditCard className="w-5 h-5 text-blue-500" />
                          )}
                          {tx.type === "profit" && (
                            <DollarSign className="w-5 h-5 text-yellow-500" />
                          )}
                          {tx.type === "transfer" && (
                            <Send className="w-5 h-5 text-purple-500" />
                          )}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {tx.description || tx.method || "-"}
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-500">
                        {tx.type === "withdrawal" ? "-" : "+"}$
                        {tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            tx.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : tx.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </motion.div>
        </div>
      </main>

      <MobileBottomNav active="wallet" />
    </div>
  );
}
