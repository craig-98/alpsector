"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Bell,
  MessageCircle,
  Search,
  User,
  Settings,
  LogOut,
  DollarSign,
  TrendingUp,
  Activity,
  Wallet,
  Shield,
  BarChart3,
  Users,
  Globe,
  Headphones,
  Menu,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CreditCard,
  Send,
  PiggyBank,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import MobileBottomNav from "@/components/MobileBottomNav";
import ActivityTicker from "@/components/ActivityTicker";
import {
  getDashboard,
  user,
  wallet,
  investments as investmentsApi,
  auth,
  transactions,
} from "@/lib/api";

// Light website theme matching tailwind.config.ts + layout
const theme = {
  wine50: "#fdf2f2",
  wine500: "#9c1b1e",
  wine600: "#8b0000",
  wine700: "#7a0f12",
  wine900: "#2d0a0c",

  "dark-grey": {
    50: "#f9fafb",
    100: "#f5f5f5",
    300: "#d1d5db",
    500: "#6b7280",
    700: "#374151",
    900: "#111827",
  },
  charcoal: "#0f0f23",
  gold: "#D4AF37",
  emerald: "#10B981",
  ruby: "#E0115F",
  slate: "#1e293b",
};

// Light glassmorphism matching website
const glass =
  "bg-white/80 backdrop-blur-xl border border-dark-grey-200 shadow-lg rounded-3xl overflow-hidden";
const glassHover =
  "hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1 hover:bg-white/90 transition-all duration-300 font-bold";

// Types for backend data
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  kycStatus?: string;
  totalProfit: number;
  dailyProfitChange: number;
}

interface WalletData {
  id: string;
  balance: number;
  bonusBalance: number;
  totalProfit: number;
  totalDeposited: number;
  totalWithdrawn: number;
  portfolioBalance: number;
}

interface Investment {
  id: string;
  assetId: string;
  assetName: string;
  amount: number;
  roi: number;
  profit: number;
  status: "active" | "completed" | "maturing";
  progress: number;
  startDate: string;
  endDate: string;
  assetType: string;
}

interface UserStats {
  totalInvested: number;
  totalProfit: number;
  activeInvestments: number;
  completedInvestments: number;
  roi: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Backend data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [userInvestments, setUserInvestments] = useState<{
    data: Investment[];
  } | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  const [open, setOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  // Transaction states
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("crypto");
  const [depositCrypto, setDepositCrypto] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("");
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState("");
  const [withdrawAccountName, setWithdrawAccountName] = useState("");

  const formSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().optional(),
    notifications: z.boolean(),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile
        ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
        : "",
      email: profile?.email || "",
      notifications: true,
      password: "",
    },
  });

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await getDashboard();

      setProfile(
        Array.isArray(dashboardData.profile)
          ? dashboardData.profile[0]
          : dashboardData.profile,
      );
      setWalletData(
        Array.isArray(dashboardData.wallet)
          ? dashboardData.wallet[0]
          : dashboardData.wallet,
      );
      setUserInvestments(dashboardData.investments || []);
      setStats(
        Array.isArray(dashboardData.stats)
          ? dashboardData.stats[0]
          : dashboardData.stats,
      );

      // Update form default values with profile data
      const profileData = Array.isArray(dashboardData.profile)
        ? dashboardData.profile[0]
        : dashboardData.profile;
      if (profileData) {
        form.reset({
          name: `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim(),
          email: profileData.email || "",
          notifications: true,
          password: "",
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");

      // If unauthorized, redirect to login
      if (
        err.message?.includes("401") ||
        err.message?.includes("Unauthorized")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/login");
      }
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
    setIsAuthenticated(true);
    fetchDashboardData();
  }, [router]);

  // Refresh data handler
  const handleRefresh = () => {
    fetchDashboardData();
    toast.success("Dashboard refreshed");
  };

  // Loading state
  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Unable to Load Dashboard
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button
            onClick={handleRefresh}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: FormData) => {
    try {
      // Update profile via API
      const nameParts = values.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await user.updateProfile({
        firstName,
        lastName,
        phone: profile?.phone,
      });

      // Update password if provided
      if (values.password) {
        await auth.changePassword("", values.password);
      }

      toast.success("Profile updated successfully!");
      setOpen(false);
      fetchDashboardData(); // Refresh data
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

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
      await transactions.deposit(
        parseFloat(depositAmount),
        depositMethod,
        undefined,
        depositCrypto,
        depositAddress,
      );
      toast.success("Deposit request submitted!");
      setDepositOpen(false);
      setDepositAmount("");
      setDepositCrypto("");
      setDepositAddress("");
      fetchDashboardData();
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
      if (!withdrawBank || !withdrawAccountNumber || !withdrawAccountName) {
        toast.error("Please fill in all bank details");
        return;
      }
      await transactions.withdraw({
        amount: parseFloat(withdrawAmount),
        bankCode: withdrawBank,
        accountNumber: withdrawAccountNumber,
        accountName: withdrawAccountName,
      });
      toast.success("Withdrawal request submitted!");
      setWithdrawOpen(false);
      setWithdrawAmount("");
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit withdrawal");
    }
  };

  const handleTransfer = async () => {
    try {
      if (!transferAmount || parseFloat(transferAmount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (!transferRecipient) {
        toast.error("Please enter a recipient");
        return;
      }
      await wallet.transfer({
        amount: parseFloat(transferAmount),
        recipient: transferRecipient,
      });
      toast.success("Transfer completed successfully!");
      setTransferOpen(false);
      setTransferAmount("");
      setTransferRecipient("");
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Transfer failed: " + err.message);
    }
  };

  // Calculate portfolio data from backend
  const availableBalance = walletData?.balance || 0;
  const portfolioValue = availableBalance + (walletData?.portfolioBalance || 0);
  const totalProfit = profile?.totalProfit || 0;
  const activeInvestmentsCount = userInvestments?.data?.filter(
    (i: any) => (i.status || "active") === "active",
  ).length;
  const pendingWithdrawalsAmount = stats?.pendingWithdrawals || 0;
  const dailyProfitChange = profile?.dailyProfitChange || 0;
  const roi =
    portfolioValue - availableBalance > 0
      ? (totalProfit / (portfolioValue - availableBalance)) * 100
      : 0;

  // Portfolio allocation for pie chart - calculated from backend investments
  const assetTypeTotals = userInvestments?.data?.reduce(
    (acc: any, inv: any) => {
      const type = inv.assetType || inv.type || "Other";
      acc[type] = (acc[type] || 0) + (inv.amount || inv.initialamount || 0);
      return acc;
    },
    {} as Record<string, number>,
  );

  const allocationData = Object.entries(assetTypeTotals || {}).map(
    ([name, value], i) => ({
      name,
      value: value as number,
      color: [
        theme.gold,
        theme.emerald,
        theme.ruby,
        theme.wine600,
        theme.slate,
      ][i % 5],
    }),
  );

  // If no investments, show a default empty state or use the hardcoded ones as fallback if preferred
  // For now, let's keep it truly dynamic but add a placeholder if empty
  if (allocationData.length === 0) {
    allocationData.push({
      name: "No Investments",
      value: 1,
      color: theme["dark-grey"][300],
    });
  }

  // Performance data
  const performanceData = [
    { date: "Jan", value: 400 },
    { date: "Feb", value: 450 },
    { date: "Mar", value: 480 },
    { date: "Apr", value: 550 },
    { date: "May", value: 600 },
  ];

  // Use backend investments data - transform to match component format
  const displayInvestments =
    userInvestments?.data?.map((inv: any) => ({
      id: `#${(inv.id || "000000").slice(-6).toUpperCase()}`,
      plan: inv.assetName || inv.assetType || inv.name || inv.plan,
      amount: inv.amount || inv.initialamount || 0,
      roi: inv.percentageProfit || inv.percentageprofit || inv.roi || 0,
      progress: inv.progress || 0,
      status: (inv.status || "active") as "active" | "maturing" | "completed",
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-grey-50 via-dark-grey-100 to-white text-black font-bold">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`${glass} bg-white/90 border-dark-grey-200 max-w-2xl mx-auto text-black font-bold`}
        >
          <DialogHeader>
            <DialogTitle className="font-bold text-black">
              Profile Settings
            </DialogTitle>
            <DialogDescription>
              Update your personal information, KYC, payments, and preferences.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-black">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline">
                    Upload Photo
                  </Button>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Leave blank to keep current"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-black">
                  KYC Verification
                </h3>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl">
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500/20 text-yellow-400"
                  >
                    Pending
                  </Badge>
                  <Button type="button" size="sm" variant="outline">
                    Upload Documents
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">
                  Payment Methods
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span>**** **** **** 4242 (Visa)</span>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      Remove
                    </Button>
                  </div>
                  <Button type="button" variant="outline" className="w-full">
                    + Add Payment Method
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">
                  Notification Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel>Email Notifications</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Receive email updates about investments and account
                          activity.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col space-y-2">
                    <Label>Push Notifications</Label>
                    <Switch />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent
          className={`${glass} bg-white/90 border-dark-grey-200 max-w-md mx-auto text-black font-bold`}
        >
          <DialogHeader>
            <DialogTitle className="font-bold text-black">
              Deposit Funds
            </DialogTitle>
            <DialogDescription>
              Add funds to your wallet to start investing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="mt-1"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <select
                className="w-full mt-1 p-2 border rounded-lg bg-gray-50 text-gray-500"
                value={depositMethod}
                disabled
              >
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            {depositMethod === "crypto" && (
              <>
                <div>
                  <Label>Cryptocurrency</Label>
                  <select
                    className="w-full mt-1 p-2 border rounded-lg"
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
                  <Label>Wallet Address</Label>
                  <Input
                    type="text"
                    placeholder="Enter your wallet address"
                    className="mt-1"
                    value={depositAddress}
                    onChange={(e) => setDepositAddress(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> After payment, upload your receipt for
                verification.
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDepositOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDeposit}>Continue to Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent
          className={`${glass} bg-white/90 border-dark-grey-200 max-w-md mx-auto text-black font-bold`}
        >
          <DialogHeader>
            <DialogTitle className="font-bold text-black">
              Withdraw Funds
            </DialogTitle>
            <DialogDescription>
              Withdraw your available balance to your bank account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${availableBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="mt-1"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
            <div>
              <Label>Bank</Label>
              <select
                className="w-full mt-1 p-2 border rounded-lg"
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
              <Label>Account Number</Label>
              <Input
                type="text"
                placeholder="Enter account number"
                className="mt-1"
                value={withdrawAccountNumber}
                onChange={(e) => setWithdrawAccountNumber(e.target.value)}
              />
            </div>
            <div>
              <Label>Account Name</Label>
              <Input
                type="text"
                placeholder="Enter account name"
                className="mt-1"
                value={withdrawAccountName}
                onChange={(e) => setWithdrawAccountName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setWithdrawOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleWithdraw}>Submit Withdrawal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent
          className={`${glass} bg-white/90 border-dark-grey-200 max-w-md mx-auto text-black font-bold`}
        >
          <DialogHeader>
            <DialogTitle className="font-bold text-black">
              Transfer Funds
            </DialogTitle>
            <DialogDescription>
              Transfer funds to another Millennium user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${availableBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <Label>Recipient Email or ID</Label>
              <Input
                type="text"
                placeholder="Enter email or user ID"
                className="mt-1"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
              />
            </div>
            <div>
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="mt-1"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setTransferOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleTransfer}>
              <Send className="w-4 h-4 mr-2" />
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="pt-20 px-6 pb-12">
        {/* Quick Actions */}
        <motion.section
          className="max-w-7xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Deposit",
                color: "emerald",
                bg: "from-emerald-500/20",
                action: () => setDepositOpen(true),
              },
              {
                icon: TrendingUp,
                title: "Invest Now",
                color: "gold",
                bg: "from-yellow-500/20",
                link: "/plans",
              },
              {
                icon: Wallet,
                title: "Withdraw",
                color: "ruby",
                bg: "from-pink-500/20",
                action: () => setWithdrawOpen(true),
              },
              {
                icon: Users,
                title: "Transfer",
                color: "wine",
                bg: "from-red-500/20",
                action: () => setTransferOpen(true),
              },
              {
                icon: BarChart3,
                title: "Portfolio",
                color: "slate",
                bg: "from-slate-500/20",
                link: "/portfolio",
              },
            ].map((action, i) => (
              <motion.div
                key={action.title}
                className={`${glass} p-8 rounded-3xl text-center cursor-pointer group`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 35px 60px -12px rgba(0,0,0,0.3)`,
                  backgroundColor: `rgba(255,255,255,0.15)`,
                }}
                onClick={
                  action.link ? () => router.push(action.link!) : action.action
                }
              >
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${action.bg} border border-gray-400/30 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all`}
                >
                  <action.icon className="w-10 h-10 text-black drop-shadow-lg" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-500 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm uppercase tracking-wider">Quick Action</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Portfolio Overview */}
        <motion.section
          className="max-w-7xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-6xl font-black bg-gradient-to-r from-black to-gray-800 bg-clip-text text-black mb-6 leading-tight">
              Portfolio Overview
            </h1>
            <p className="text-xl text-black font-bold max-w-2xl mx-auto">
              Monitor your global investment performance with
              institutional-grade analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Total Portfolio",
                value: portfolioValue,
                change: 12.4,
                icon: DollarSign,
                color: "emerald",
              },
              {
                title: "Lifetime Profit",
                value:
                  (totalProfit >= 0 ? "+" : "") + totalProfit.toLocaleString(),
                change: dailyProfitChange,
                icon: TrendingUp,
                color: "gold",
              },
              {
                title: "Active Investments",
                value: activeInvestmentsCount,
                change: 2.1,
                icon: Activity,
                color: "wine",
              },
              {
                title: "Available Balance",
                value: availableBalance,
                change: -0.5,
                icon: Wallet,
                color: "ruby",
              },
              {
                title: "Pending Withdrawals",
                value: pendingWithdrawalsAmount,
                change: 1.3,
                icon: Shield,
                color: "slate",
              },
              {
                title: "ROI",
                value: `${roi.toFixed(1)}%`,
                change: 3.7,
                icon: BarChart3,
                color: "emerald",
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                className={`${glass} p-8 md:p-10`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-2xl border border-emerald-400/30 shadow-lg">
                    <metric.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <Badge
                    className={`text-xs font-bold px-4 py-2 rounded-full shadow-lg ${metric.change > 0 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20" : "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20"}`}
                  >
                    {metric.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3 inline" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 inline" />
                    )}{" "}
                    {Math.abs(metric.change)}%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-black mb-3 capitalize tracking-tight">
                  {metric.title}
                </h3>
                <div className="text-5xl font-black text-black mb-1">
                  {typeof metric.value === "number"
                    ? `${metric.value.toLocaleString()}`
                    : metric.value}
                </div>
                <p className="text-black text-sm uppercase tracking-wider font-bold">
                  Institutional Grade
                </p>
              </motion.div>
            ))}
          </div>

          {/* Performance Chart */}
          <motion.div
            className={`${glass} p-8 rounded-3xl`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Portfolio Performance
                </h3>
                <p className="text-black font-bold">
                  Interactive chart with timeframe selector
                </p>
              </div>
              <Tabs defaultValue="monthly" className="w-full md:w-auto">
                <TabsList className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl p-1 space-x-1">
                  <TabsTrigger
                    value="daily"
                    className="data-[state=active]:bg-gold data-[state=active]:text-slate-900 rounded-xl px-4 py-2 font-medium"
                  >
                    Daily
                  </TabsTrigger>
                  <TabsTrigger
                    value="weekly"
                    className="data-[state=active]:bg-gold data-[state=active]:text-slate-900 rounded-xl px-4 py-2 font-medium"
                  >
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger
                    value="monthly"
                    className="data-[state=active]:bg-gold data-[state=active]:text-slate-900 rounded-xl px-4 py-2 font-medium"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="data-[state=active]:bg-gold data-[state=active]:text-slate-900 rounded-xl px-4 py-2 font-medium"
                  >
                    Yearly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <defs>
                  <linearGradient id="performance" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={20}
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={20}
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,15,35,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", strokeWidth: 2 }}
                  activeDot={{ r: 8, strokeWidth: 3 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  fill="url(#performance)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.section>

        {/* Asset Allocation */}
        <motion.section
          className="max-w-7xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black bg-gradient-to-r from-black via-wine to-dark-grey-900 bg-clip-text text-black mb-6 font-bold">
              Asset Allocation
            </h2>
            <p className="text-xl text-black font-bold max-w-2xl mx-auto">
              Your portfolio diversification across asset classes
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Pie Chart */}
            <motion.div
              className={`${glass} p-8 rounded-3xl h-[400px] flex items-center justify-center`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart data={allocationData}>
                  <Pie
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    nameKey="name"
                  >
                    {allocationData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={3}
                        stroke="rgba(255,255,255,0.2)"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
            {/* Allocation Table */}
            <motion.div className={`${glass} p-8 rounded-3xl`}>
              <h3 className="text-2xl font-bold text-black mb-8 text-left font-bold">
                Detailed Breakdown
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black font-bold">
                      Asset Class
                    </TableHead>
                    <TableHead className="text-black font-bold text-right">
                      Allocation
                    </TableHead>
                    <TableHead className="text-black font-bold text-right">
                      Value
                    </TableHead>
                    <TableHead className="text-black font-bold text-right">
                      Risk Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocationData.map((asset: any) => (
                    <TableRow
                      key={asset.name}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="font-medium text-black font-bold capitalize">
                        {asset.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: asset.color }}
                          />
                          <span className="text-gold font-bold">
                            {asset.value.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-black">
                        $
                        {(
                          (portfolioValue * asset.value) /
                          100
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30 text-orange-400 font-bold">
                          Medium
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </motion.section>

        {/* Active Investments Table */}
        <motion.section
          className="max-w-7xl mx-auto mb-16 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-black via-wine to-dark-grey-900 bg-clip-text text-black mb-2 font-bold">
                Active Investments
              </h2>
              <p className="text-xl text-black font-bold">
                Monitor your ongoing investment positions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
              <Input
                placeholder="Search investments..."
                className={`${glass} rounded-2xl bg-white/5 border-white/10 text-white placeholder-slate-400`}
              />
              <Button className="bg-gradient-to-r from-wine to-ruby hover:from-ruby hover:to-wine text-gold font-bold px-8 py-6 rounded-2xl shadow-2xl hover:shadow-wine/20 transition-all">
                Invest Now
              </Button>
            </div>
          </div>

          <motion.div
            className={`${glass} rounded-3xl overflow-hidden shadow-2xl`}
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="text-black font-bold w-20">
                    ID
                  </TableHead>
                  <TableHead className="text-black font-bold">Plan</TableHead>
                  <TableHead className="text-black font-bold text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-black font-bold text-right">
                    ROI
                  </TableHead>
                  <TableHead className="text-black font-bold">
                    Progress
                  </TableHead>
                  <TableHead className="text-black font-bold w-28">
                    Status
                  </TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayInvestments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-400">
                        <PiggyBank className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No active investments yet</p>
                        <Button
                          variant="link"
                          onClick={() => router.push("/plans")}
                          className="text-gold"
                        >
                          Start Investing
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayInvestments.map((investment) => (
                    <TableRow
                      key={investment.id}
                      className="border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="font-mono text-sm text-black font-bold">
                        {investment.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald to-gold rounded-xl flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-5 h-5 text-slate-900" />
                          </div>
                          <div>
                            <p className="font-bold text-black">
                              {investment.plan}
                            </p>
                            <p className="text-sm text-black font-bold">
                              ${investment.amount.toLocaleString()} invested
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald">
                        ${investment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gradient-to-r from-emerald-500/20 to-gold/20 border-emerald-400/30 text-emerald-400 font-bold">
                          +{investment.roi}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Progress
                          value={investment.progress}
                          className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-gold [&>div]:shadow-lg"
                        />
                        <p className="text-xs text-black font-bold text-right mt-1">
                          {investment.progress}%
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            investment.status === "maturing"
                              ? "default"
                              : investment.status === "completed"
                                ? "secondary"
                                : "secondary"
                          }
                          className={`font-bold ${investment.status === "maturing" ? "bg-gradient-to-r from-gold to-emerald text-slate-900 border-gold/30 shadow-gold/20" : "bg-white/10 text-slate-300 border-white/20"}`}
                        >
                          {investment.status.charAt(0).toUpperCase() +
                            investment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-9 w-9 rounded-xl hover:bg-white/10 p-0"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className={`${glass} border-white/20 bg-slate-900 mt-1`}
                          >
                            <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl cursor-pointer">
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl cursor-pointer">
                              Withdraw
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-white/10 rounded-xl cursor-pointer text-destructive">
                              Close
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </motion.div>

          {/* Floating Invest Button */}
          <motion.div
            className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-40"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald to-gold hover:from-gold hover:to-emerald text-slate-900 font-black px-12 py-8 rounded-3xl shadow-2xl hover:shadow-emerald/25 text-lg"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Invest Now
            </Button>
          </motion.div>
        </motion.section>

        <ActivityTicker />
      </main>
    </div>
  );
}
