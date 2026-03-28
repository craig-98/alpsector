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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import MobileBottomNav from "@/components/MobileBottomNav";
import { transactions, wallet, apiFetch } from "@/lib/api";

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
  const [globalSettings, setGlobalSettings] = useState({
    crypto: "BTC",
    address: "",
  });
  const [depositProof, setDepositProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const [walletResponse, transactionsData, cryptoInfo] = await Promise.all([
        wallet.get().catch(() => null),
        transactions.getAll().catch(() => []),
        apiFetch("/crypto").catch(() => ({
          data: { crypto: "BTC", address: "" },
        })),
      ]);

      setWalletData(walletResponse);
      setTransactionsList(transactionsData?.data || transactionsData || []);

      if (cryptoInfo?.data) {
        setGlobalSettings(cryptoInfo.data);
        setDepositCrypto(cryptoInfo.data.crypto);
        setDepositAddress(cryptoInfo.data.address);
      }
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
      if (!depositProof) {
        toast.error("Please upload proof of payment (screenshot/receipt)");
        return;
      }
      
      await transactions.deposit(
        parseFloat(depositAmount),
        depositMethod,
        depositProof,
        globalSettings.crypto,
        globalSettings.address,
      );
      toast.success("Deposit request submitted! Admin will verify your proof.");
      setShowDeposit(false);
      setDepositAmount("");
      setDepositProof(null);
      setProofPreview(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit deposit");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setDepositProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center p-8 relative z-10 glass-panel rounded-3xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-emerald-500 border-b-transparent border-l-transparent mx-auto mb-6"></div>
          <p className="text-xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">Loading wallet...</p>
        </div>
      </div>
    );
  }

  const balance = walletData?.balance || 0;
  const bonusBalance = walletData?.bonusBalance || 0;
  const totalDeposited = walletData?.totalDeposited || 0;
  const totalWithdrawn = walletData?.totalWithdrawn || 0;

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans relative overflow-hidden pb-28">
      <div className="fixed top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ArrowDownRight className="w-5 h-5 rotate-[135deg]" />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Wallet</h1>
              <p className="text-brand-muted">Manage your funds and transactions</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={fetchData}
            className="rounded-xl bg-transparent border-white/10 text-white hover:bg-white/5 font-bold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Hero Balance Card */}
        <motion.div
          className="glass-panel p-8 md:p-10 rounded-3xl mb-12 relative overflow-hidden bg-gradient-to-br from-brand-surface to-emerald-900/10 border-emerald-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-brand-muted font-bold uppercase tracking-wider text-sm mb-2">Total Balance</p>
            <p className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              ${balance.toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setShowDeposit(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black rounded-xl px-8 py-6 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
              >
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Deposit
              </Button>
              <Button
                onClick={() => setShowWithdraw(true)}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 font-bold rounded-xl px-8 py-6"
              >
                <ArrowDownRight className="w-5 h-5 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ArrowUpRight className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-brand-muted font-bold uppercase tracking-wider text-sm">Total Deposited</p>
            </div>
            <p className="text-4xl font-black">${totalDeposited.toLocaleString()}</p>
          </motion.div>

          <motion.div
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <ArrowDownRight className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-brand-muted font-bold uppercase tracking-wider text-sm">Total Withdrawn</p>
            </div>
            <p className="text-4xl font-black">${totalWithdrawn.toLocaleString()}</p>
          </motion.div>

          <motion.div
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-brand-muted font-bold uppercase tracking-wider text-sm">Bonus Balance</p>
            </div>
            <p className="text-4xl font-black">${bonusBalance.toLocaleString()}</p>
          </motion.div>
        </div>

          {showDeposit && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel border border-white/10 rounded-3xl p-0 max-w-md w-full relative overflow-hidden"
              >
                <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-8 custom-scrollbar">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6 relative z-10">
                    Deposit Funds
                  </h2>
                  <div className="space-y-4 sm:space-y-5 relative z-10">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        Amount (USD)
                      </label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        Payment Method
                      </label>
                      <Select value={depositMethod} disabled>
                        <SelectTrigger className="w-full p-3 sm:p-4 h-auto bg-white/5 border-white/10 text-white font-bold rounded-2xl opacity-70">
                          <SelectValue placeholder="Cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent className="bg-brand-surface border-white/10 text-white">
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {depositMethod === "crypto" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                            Cryptocurrency Network
                          </label>
                          <div className="w-full p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold opacity-70 cursor-not-allowed text-sm">
                            {globalSettings.crypto}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                            Official Deposit Address
                          </label>
                          <div className="w-full p-3 sm:p-4 bg-white/5 border border-emerald-500/30 rounded-2xl text-emerald-400 font-mono text-[10px] sm:text-xs break-all leading-tight">
                            {globalSettings.address || "Address not configured."}
                          </div>
                        </div>
                        <p className="text-[10px] text-brand-muted font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                          <span className="text-emerald-400 font-bold">
                            Important:
                          </span>{" "}
                          Send exactly the requested amount in{" "}
                          <span className="text-white font-bold">
                            {globalSettings.crypto}
                          </span>{" "}
                          to the address above. Your deposit will be credited
                          after network confirmations.
                        </p>
                      </div>
                    )}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        Upload Proof of Payment
                      </label>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="proof-upload-wallet"
                        />
                        <label
                          htmlFor="proof-upload-wallet"
                          className={`flex flex-col items-center justify-center w-full min-h-[80px] sm:min-h-[120px] rounded-2xl sm:rounded-3xl border-2 border-dashed ${
                            proofPreview ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10 hover:border-white/25 bg-white/5"
                          } cursor-pointer transition-all p-3 sm:p-4 text-center overflow-hidden relative`}
                        >
                          {proofPreview ? (
                            <div className="relative w-full h-full flex flex-col items-center gap-2">
                              <img src={proofPreview} alt="Proof" className="w-full max-h-24 sm:max-h-40 object-contain rounded-xl shadow-2xl" />
                              <p className="text-[10px] text-emerald-400 font-bold">File Selected - Click to Change</p>
                            </div>
                          ) : (
                            <>
                              <ArrowUpRight className="w-8 h-8 text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                              <p className="text-sm font-bold text-white">Click to upload screenshot</p>
                              <p className="text-[10px] text-brand-muted mt-1">PNG, JPG or PDF (MAX. 10MB)</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6 sm:mt-8 relative z-10">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeposit(false);
                        setProofPreview(null);
                        setDepositProof(null);
                      }}
                      className="flex-1 rounded-xl bg-transparent border-white/10 text-white hover:bg-white/5 font-bold h-10 sm:h-12 text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeposit}
                      disabled={!globalSettings.address || !depositProof}
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all h-10 sm:h-12 text-sm disabled:opacity-50"
                    >
                      Submit Proof
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {showWithdraw && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel border border-white/10 rounded-3xl p-0 max-w-md w-full relative overflow-hidden"
              >
                <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-8 custom-scrollbar">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6 relative z-10">
                    Withdraw Funds
                  </h2>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6 relative z-10">
                    <p className="text-xs text-emerald-400/80 font-bold mb-1">
                      Available Balance
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                      ${balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-4 sm:space-y-5 relative z-10">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        Amount (USD)
                      </label>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        Receiving Bank / Protocol
                      </label>
                      <Select
                        value={withdrawBank}
                        onValueChange={setWithdrawBank}
                      >
                        <SelectTrigger className="w-full p-3 sm:p-4 h-auto bg-white/5 border-white/10 text-white font-bold rounded-2xl">
                          <SelectValue placeholder="Select institution" />
                        </SelectTrigger>
                        <SelectContent className="bg-brand-surface border-white/10 text-white">
                          <SelectItem value="Bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="Ethereum">
                            Ethereum (ERC20)
                          </SelectItem>
                          <SelectItem value="Tether">Tether (TRC20)</SelectItem>
                          <SelectItem value="Bank Wire">
                            International Wire
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        Wallet Address / Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter destination details"
                        className="w-full p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        value={withdrawAccountNumber}
                        onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6 sm:mt-8 relative z-10">
                    <Button
                      variant="outline"
                      onClick={() => setShowWithdraw(false)}
                      className="flex-1 rounded-xl bg-transparent border-white/10 text-white hover:bg-white/5 font-bold h-10 sm:h-12 text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || !withdrawBank || !withdrawAccountNumber}
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all h-10 sm:h-12 text-sm disabled:opacity-50"
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

        {/* Transaction History */}
        <motion.div
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Transaction History
          </h2>

          {transactionsList.length === 0 ? (
            <div className="text-center py-12 text-brand-muted">
              <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold">Type</th>
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold">Description</th>
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold text-right">Amount</th>
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold">Status</th>
                    <th className="p-4 sm:p-6 text-xs text-brand-muted uppercase tracking-wider font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactionsList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 sm:p-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            tx.type === "deposit" ? "bg-emerald-500/10 border-emerald-500/20" :
                            tx.type === "withdrawal" ? "bg-red-500/10 border-red-500/20" :
                            tx.type === "transfer" ? "bg-purple-500/10 border-purple-500/20" :
                            "bg-blue-500/10 border-blue-500/20"
                          }`}>
                            {tx.type === "deposit" && <ArrowUpRight className="w-5 h-5 text-emerald-400" />}
                            {tx.type === "withdrawal" && <ArrowDownRight className="w-5 h-5 text-red-400" />}
                            {tx.type === "investment" && <CreditCard className="w-5 h-5 text-blue-400" />}
                            {tx.type === "profit" && <DollarSign className="w-5 h-5 text-yellow-400" />}
                            {tx.type === "transfer" && <Send className="w-5 h-5 text-purple-400" />}
                          </div>
                          <span className="capitalize font-bold text-white">{tx.type}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6 text-brand-muted">
                        {tx.description || tx.method || "-"}
                      </td>
                      <td className={`p-4 sm:p-6 text-right font-black ${tx.type === "withdrawal" ? "text-red-400" : "text-emerald-400"}`}>
                        {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toLocaleString()}
                      </td>
                      <td className="p-4 sm:p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          tx.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                            : tx.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                              : "bg-red-500/20 text-red-400 border border-red-500/20"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 sm:p-6 text-brand-muted">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      <MobileBottomNav active="wallet" />
    </div>
  );
}
