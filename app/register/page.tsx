"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api";
import Link from "next/link";

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/\d/.test(password)) errors.push("One number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    errors.push("One special character");
  return errors;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "Nigeria",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData((prev) => ({ ...prev, password: newPassword }));
    setPasswordErrors(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationErrors = validatePassword(formData.password);
    if (validationErrors.length > 0) {
      setError(`Password must have: ${validationErrors.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      await auth.register(formData);
      // Registration successful but we don't get a token yet. Need to verify email.
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand-dark py-12 px-4">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 my-8">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <img
                src="/alpsectorlogo.PNG"
                alt="Alpsector Logo"
                className="w-14 h-14 relative bg-brand-surface rounded-xl shadow-2xl object-contain ring-1 ring-white/10"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Join Alpsector
          </h1>
          <p className="text-brand-muted">
            Provide your details to open an institutional account
          </p>
        </div>

        {success ? (
          <div className="glass-panel p-10 text-center relative overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-3xl opacity-20 pointer-events-none" />
            <div className="w-20 h-20 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/50 relative z-10">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 relative z-10">
              Registration Successful!
            </h2>
            <p className="text-brand-muted mb-8 text-lg font-medium relative z-10">
              We've sent a verification link to{" "}
              <span className="text-white font-bold">{formData.email}</span>.
              Please verify your email to log in and complete your{" "}
              <span className="text-emerald-400 font-bold">
                KYC Verification
              </span>
              .
            </p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center bg-white text-black font-black text-lg px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-xl relative z-10"
            >
              Proceed to Login
            </Link>
          </div>
        ) : (
          <div className="glass-panel p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-brand-muted"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange("firstName")}
                    required
                    className="w-full bg-brand-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-brand-muted"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange("lastName")}
                    required
                    className="w-full bg-brand-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brand-muted"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                  className="w-full bg-brand-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-brand-muted"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    required
                    className="w-full bg-brand-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-brand-muted"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={handleChange("country")}
                    required
                    className="w-full bg-brand-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-brand-muted"
                >
                  Secure Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full bg-brand-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
                {formData.password && passwordErrors.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-lg mt-2 text-xs text-red-400">
                    <p className="font-bold mb-1">Password must contain:</p>
                    <ul className="list-disc list-inside opacity-90 space-y-1">
                      {passwordErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || passwordErrors.length > 0}
                className="w-full relative group mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative bg-brand-surface hover:bg-transparent px-6 py-3.5 rounded-lg flex items-center justify-center font-bold text-white transition-all shadow-glass w-full">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-emerald-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Institutional Account"
                  )}
                </div>
              </button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-white/5">
              <p className="text-sm text-brand-muted">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Sign in deeply
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
