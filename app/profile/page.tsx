"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Lock,
  LogOut,
  Camera,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import MobileBottomNav from "@/components/MobileBottomNav";
import { user, auth } from "@/lib/api";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  kycStatus?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const profileData = await user.getProfile();
      const actualProfile = Array.isArray(profileData)
        ? profileData[0]
        : profileData;
      setProfile(actualProfile);
      setFirstName(actualProfile.firstName || "");
      setLastName(actualProfile.lastName || "");
      setPhone(actualProfile.phone || "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
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
    fetchProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await user.updateProfile({ firstName, lastName, phone });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center p-8 relative z-10 glass-panel rounded-3xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-emerald-500 border-b-transparent border-l-transparent mx-auto mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-grey-50 via-dark-grey-100 to-white text-black font-bold pb-24">
      <header className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-black mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>
      </header>

      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Profile Card */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-gray-600">{profile?.email}</p>
                <Badge className="mt-2 bg-emerald-100 text-emerald-700">
                  {profile?.kycStatus === "verified"
                    ? "Verified"
                    : "Pending Verification"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  value={profile?.email || ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="mt-6 bg-emerald-600"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </motion.div>

          {/* KYC Status */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-black mb-6">
              Verification Status
            </h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              {profile?.kycStatus === "verified" ? (
                <>
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="font-bold text-black">Account Verified</p>
                    <p className="text-sm text-gray-600">
                      Your identity has been verified
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="font-bold text-black">Verification Pending</p>
                    <p className="text-sm text-gray-600">
                      Complete KYC to unlock all features
                    </p>
                  </div>
                  <Button className="ml-auto bg-emerald-600">
                    Complete KYC
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-black mb-6">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-bold text-black">Change Password</p>
                    <p className="text-sm text-gray-600">
                      Update your password
                    </p>
                  </div>
                </div>
                <Button variant="outline">Change</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-bold text-black">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-600">Add extra security</p>
                  </div>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-black mb-6">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-bold text-black">Email Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-bold text-black">Push Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive push notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full py-6"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
          </motion.div>
        </div>
      </main>

      <MobileBottomNav active="profile" />
    </div>
  );
}
