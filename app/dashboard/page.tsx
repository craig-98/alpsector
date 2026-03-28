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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  apiFetch,
} from "@/lib/api";

// Dark website theme matching tailwind.config.ts + layout
const theme = {
  emerald: "#10B981",
  "brand-dark": "#0A0A0B",
  "brand-surface": "#121214",
  "brand-muted": "#A1A1AA",
  gold: "#D4AF37",
  ruby: "#E0115F",
  wine600: "#9F1239",
  slate: "#1e293b",
};

// Dark glassmorphism matching website
const glass =
  "glass-panel";
const glassHover =
  "glass-panel-hover font-bold";

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
  const [depositProof, setDepositProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [globalSettings, setGlobalSettings] = useState({ crypto: "BTC", address: "" });

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

      const [dashboardData, cryptoInfo] = await Promise.all([
        getDashboard(),
        apiFetch("/crypto").catch(() => ({ data: { crypto: "BTC", address: "" } })),
      ]);

      if (cryptoInfo?.data) {
        setGlobalSettings(cryptoInfo.data);
        setDepositCrypto(cryptoInfo.data.crypto);
        setDepositAddress(cryptoInfo.data.address);
      }

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

  // Invest Now handler - checks auth + balance
  const handleInvestNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to invest");
      router.push("/login");
      return;
    }
    if (availableBalance <= 0) {
      toast("Insufficient balance. Please deposit funds first.", {
        action: {
          label: "Deposit",
          onClick: () => setDepositOpen(true),
        },
      });
      setDepositOpen(true);
      return;
    }
    router.push("/plans");
  };

  // Loading state
  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center p-8 relative z-10 glass-panel rounded-3xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-emerald-500 border-b-transparent border-l-transparent mx-auto mb-6"></div>
      
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center p-8 relative z-10 glass-panel rounded-3xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Unable to Load Dashboard
          </h2>
          <p className="text-brand-muted mb-6">{error}</p>
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
      if (!globalSettings.address) {
        toast.error("Deposit address not configured. Contact support.");
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
      setDepositOpen(false);
      setDepositAmount("");
      setDepositProof(null);
      setProofPreview(null);
      fetchDashboardData();
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

  // If no investments, show suggested allocation categories
  if (allocationData.length === 0) {
    allocationData.push(
      { name: "Crypto", value: 35, color: theme.gold },
      { name: "Stocks", value: 30, color: theme.emerald },
      { name: "Real Estate", value: 20, color: theme.ruby },
      { name: "Bonds", value: 15, color: theme.slate },
    );
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
    <div className="min-h-screen bg-brand-dark text-white font-sans">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`${glass} bg-brand-surface border-brand-border text-white font-bold`}
        >
          <DialogHeader>
            <DialogTitle className="font-bold text-white">
              Profile Settings
            </DialogTitle>
            <DialogDescription>
              Update your personal information, KYC, payments, and preferences.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-white">
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
                <h3 className="text-xl font-black text-white">
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
                <h3 className="text-xl font-bold text-white">
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
                <h3 className="text-xl font-bold text-white">
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
          className={`${glass} bg-brand-surface border-brand-border text-white font-bold p-0 max-w-md w-full overflow-hidden rounded-3xl`}
        >
          <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-8 custom-scrollbar">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            <DialogHeader className="relative z-10 mb-4 sm:mb-6">
              <DialogTitle className="text-2xl sm:text-3xl font-black text-white">
                Deposit Funds
              </DialogTitle>
              <DialogDescription className="text-brand-muted text-xs sm:text-sm">
                Add funds to your wallet to start investing.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-5 relative z-10">
              <div>
                <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Amount (USD)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 sm:p-4 h-auto bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div>
                <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Payment Method</Label>
                <Select value={depositMethod} disabled>
                  <SelectTrigger className="w-full p-3 sm:p-4 h-auto bg-white/5 border border-white/10 text-white font-bold rounded-2xl opacity-70">
                    <SelectValue placeholder="Cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {depositMethod === "crypto" && (
                <>
                  <div>
                    <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Cryptocurrency Network</Label>
                    <div className="w-full p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold opacity-70 cursor-not-allowed text-sm">
                      {globalSettings.crypto}
                    </div>
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Official Deposit Address</Label>
                    <div className="w-full p-3 sm:p-4 bg-white/5 border border-emerald-500/30 rounded-2xl text-emerald-400 font-mono text-[10px] sm:text-xs break-all leading-tight">
                      {globalSettings.address || 'Address not configured.'}
                    </div>
                  </div>
                </>
              )}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-xs text-brand-muted font-medium">
                  <span className="text-emerald-400 font-bold">Important:</span> Send exactly the requested amount in{" "}
                  <span className="text-white font-bold">{globalSettings.crypto}</span> to the address above. Your deposit will be credited after network confirmations.
                </p>
              </div>
              <div className="pt-1">
                <Label className="block text-[10px] font-bold text-brand-muted mb-2 uppercase tracking-wider">
                  Upload Proof of Payment
                </Label>
                <div className="relative group">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="proof-upload"
                  />
                  <label
                    htmlFor="proof-upload"
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
                        <ArrowUpRight className="w-8 h-8 text-brand-muted mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-sm font-bold text-white">Click to upload screenshot</p>
                        <p className="text-xs text-brand-muted mt-1">PNG, JPG or PDF (MAX. 10MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 relative z-10">
              <Button
                variant="outline"
                onClick={() => {
                  setDepositOpen(false);
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
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent
          className={`${glass} bg-brand-surface border-brand-border text-white font-bold p-0 max-w-md w-full overflow-hidden rounded-3xl`}
        >
          <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-8 custom-scrollbar">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            <DialogHeader className="relative z-10 mb-4 sm:mb-6">
              <DialogTitle className="text-2xl sm:text-3xl font-black text-white">
                Withdraw Funds
              </DialogTitle>
              <DialogDescription className="text-brand-muted text-xs sm:text-sm">
                Withdraw your available balance securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-5 relative z-10">
              <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4 sm:mb-6">
                <p className="text-xs text-emerald-400/80 font-bold mb-1">Available Balance</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                  ${availableBalance.toLocaleString()}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Amount (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 sm:p-4 h-auto bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Receiving Bank / Protocol</Label>
                  <Select value={withdrawBank} onValueChange={setWithdrawBank}>
                    <SelectTrigger className="w-full p-3 sm:p-4 h-auto bg-brand-dark border border-white/10 text-white font-bold rounded-2xl">
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent className="bg-brand-surface border-white/10 text-white">
                      <SelectItem value="Bitcoin">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="Ethereum">Ethereum (ERC20)</SelectItem>
                      <SelectItem value="Tether">Tether (TRC20)</SelectItem>
                      <SelectItem value="Bank Wire">International Wire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Wallet Address / Account Number</Label>
                  <Input
                    placeholder="Enter destination details"
                    className="w-full p-3 sm:p-4 h-auto bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    value={withdrawAccountNumber}
                    onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Account Name</Label>
                  <Input
                    placeholder="Enter account name"
                    className="w-full p-3 sm:p-4 h-auto bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    value={withdrawAccountName}
                    onChange={(e) => setWithdrawAccountName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 relative z-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWithdrawOpen(false)}
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
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent
          className={`${glass} bg-brand-surface border-brand-border text-white font-bold p-0 max-w-md w-full overflow-hidden rounded-3xl`}
        >
          <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-8 custom-scrollbar">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            <DialogHeader className="relative z-10 mb-4 sm:mb-6">
              <DialogTitle className="text-2xl sm:text-3xl font-black text-white">
                Transfer Funds
              </DialogTitle>
              <DialogDescription className="text-brand-muted text-xs sm:text-sm">
                Transfer funds securely to another Millennium user.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-5 relative z-10">
              <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4 sm:mb-6">
                <p className="text-xs text-emerald-400/80 font-bold mb-1">Available Balance</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                  ${availableBalance.toLocaleString()}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Recipient Email or ID</Label>
                  <Input
                    placeholder="Enter email or user ID"
                    className="w-full p-3 sm:p-4 h-auto bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Amount (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-3 sm:p-4 h-auto bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 relative z-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTransferOpen(false)}
                  className="flex-1 rounded-xl bg-transparent border-white/10 text-white hover:bg-white/5 font-bold h-10 sm:h-12 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTransfer}
                  disabled={!transferAmount || !transferRecipient}
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all h-10 sm:h-12 text-sm disabled:opacity-50"
                >
                  Transfer Now
                </Button>
              </DialogFooter>
            </div>
          </div>
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
                action: handleInvestNow,
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
                  <action.icon className="w-10 h-10 text-white drop-shadow-lg" />
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
            <h1 className="text-6xl font-black bg-gradient-to-r from-black to-gray-800 bg-clip-text text-white mb-6 leading-tight">
              Portfolio Overview
            </h1>
            <p className="text-xl text-white font-bold max-w-2xl mx-auto">
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
                    className={`text-xs font-bold px-4 py-2 rounded-full shadow-lg ${metric.change > 0 ? "bg-emerald-500/100/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20" : "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20"}`}
                  >
                    {metric.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3 inline" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 inline" />
                    )}{" "}
                    {Math.abs(metric.change)}%
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 capitalize tracking-tight">
                  {metric.title}
                </h3>
                <div className="text-5xl font-black text-white mb-1">
                  {typeof metric.value === "number"
                    ? `${metric.value.toLocaleString()}`
                    : metric.value}
                </div>
                <p className="text-white text-sm uppercase tracking-wider font-bold">
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
                <h3 className="text-2xl font-bold text-white mb-2">
                  Portfolio Performance
                </h3>
                <p className="text-white font-bold">
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
            <h2 className="text-4xl font-black bg-gradient-to-r from-black via-wine to-dark-grey-900 bg-clip-text text-white mb-6 font-bold">
              Asset Allocation
            </h2>
            <p className="text-xl text-white font-bold max-w-2xl mx-auto">
              {(userInvestments?.data?.length || 0) > 0 
                ? "Your portfolio diversification across asset classes"
                : "Suggested allocation strategy — start investing to build your portfolio"}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Pie Chart */}
            <motion.div
              className={`${glass} p-8 rounded-3xl h-[400px] flex items-center justify-center`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    nameKey="name"
                    paddingAngle={4}
                  >
                    {allocationData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={2}
                        stroke="rgba(255,255,255,0.1)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,15,20,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    formatter={(value: any, name: string) => [`${value}%`, name]}
                  />
                  <Legend
                    wrapperStyle={{ color: "#A1A1AA", fontSize: "12px", fontWeight: "bold" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
            {/* Allocation Table */}
            <motion.div className={`${glass} p-8 rounded-3xl`}>
              <h3 className="text-2xl font-bold text-white mb-8 text-left font-bold">
                Detailed Breakdown
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white font-bold">
                      Asset Class
                    </TableHead>
                    <TableHead className="text-white font-bold text-right">
                      Allocation
                    </TableHead>
                    <TableHead className="text-white font-bold text-right">
                      Value
                    </TableHead>
                    <TableHead className="text-white font-bold text-right">
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
                      <TableCell className="font-medium text-white font-bold capitalize">
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
                      <TableCell className="text-right font-bold text-white">
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
              <h2 className="text-4xl font-black bg-gradient-to-r from-black via-wine to-dark-grey-900 bg-clip-text text-white mb-2 font-bold">
                Active Investments
              </h2>
              <p className="text-xl text-white font-bold">
                Monitor your ongoing investment positions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
              <Input
                placeholder="Search investments..."
                className={`${glass} rounded-2xl bg-white/5 border-white/10 text-white placeholder-slate-400`}
              />
              <Button 
                onClick={handleInvestNow}
                className="bg-gradient-to-r from-wine to-ruby hover:from-ruby hover:to-wine text-gold font-bold px-8 py-6 rounded-2xl shadow-2xl hover:shadow-wine/20 transition-all font-black"
              >
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
                  <TableHead className="text-white font-bold w-20">
                    ID
                  </TableHead>
                  <TableHead className="text-white font-bold">Plan</TableHead>
                  <TableHead className="text-white font-bold text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-white font-bold text-right">
                    ROI
                  </TableHead>
                  <TableHead className="text-white font-bold">
                    Progress
                  </TableHead>
                  <TableHead className="text-white font-bold w-28">
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
                      <TableCell className="font-mono text-sm text-white font-bold">
                        {investment.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald to-gold rounded-xl flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-5 h-5 text-slate-900" />
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {investment.plan}
                            </p>
                            <p className="text-sm text-white font-bold">
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
                        <p className="text-xs text-white font-bold text-right mt-1">
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
              onClick={handleInvestNow}
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
