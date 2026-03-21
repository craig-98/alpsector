// Base API configuration
const API_BASE = "http://localhost:4000/api/v1";

// Get auth tokens from localStorage (client-side only)
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};
const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

// API fetch wrapper with auth
const api = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const refreshToken = getRefreshToken();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(refreshToken && { "x-refresh-token": refreshToken }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `Error: ${response.status}`);
  }

  return response.json();
};

// =====================
// AUTH
// =====================
export const auth = {
  login: (data: { email: string; password: string }) =>
    api("/auth/sign-in", { method: "POST", body: JSON.stringify(data) }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    refCode?: string;
  }) => api("/auth/sign-up", { method: "POST", body: JSON.stringify(data) }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return api("/auth/sign-out");
  },

  forgotPassword: (email: string) =>
    api("/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resendVerification: (email: string) =>
    api("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    api("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api("/auth/password/change", {
      method: "POST",
      body: JSON.stringify({
        password: newPassword,
        confirmPassword: newPassword,
      }),
    }),

  verify: (token: string) =>
    api(`/auth/verify-account?verificationToken=${token}`),
};

// =====================
// USER
// =====================
export const user = {
  getProfile: () => api("/user"),
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) =>
    api("/user/update-user", { method: "POST", body: JSON.stringify(data) }),
  getStats: () => api("/user/statistics"),
  getCompanyPhone: () => api("/user/company"),
  updateCompanyPhone: (data: { phone: string; whatsapp: string }) =>
    api("/user/company-phone", { method: "POST", body: JSON.stringify(data) }),
};

// =====================
// WALLET
// =====================
export const wallet = {
  get: () => api("/wallet/user"),
  transfer: (data: {
    recipient: string;
    amount: number;
    description?: string;
  }) =>
    api("/transaction/transfer", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// =====================
// TRANSACTIONS
// =====================
export const transactions = {
  getAll: () => api("/transaction/user"),
  getDeposits: () => api("/transaction/deposits"),
  getWithdrawals: () => api("/transaction/withdrawals"),
  getBanks: () => api("/transaction/banks"),

  deposit: async (
    amount: number,
    method: string,
    paymentProof?: File,
    crypto?: string,
    address?: string,
  ) => {
    if (paymentProof) {
      const formData = new FormData();
      formData.append("amount", amount.toString());
      formData.append("method", method);
      formData.append("paymentProof", paymentProof);
      if (crypto) formData.append("crypto", crypto);
      if (address) formData.append("address", address);
      const token = getToken();
      const refreshToken = getRefreshToken();
      const response = await fetch(`${API_BASE}/transaction/deposit`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(refreshToken && { "x-refresh-token": refreshToken }),
        },
        body: formData,
      });
      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Deposit failed" }));
        throw new Error(error.message || "Deposit failed");
      }
      return response.json();
    }
    return api("/transaction/deposit", {
      method: "POST",
      body: JSON.stringify({ amount, method, crypto, address }),
    });
  },

  withdraw: (data: {
    amount: number;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  }) =>
    api("/transaction/withdraw", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// =====================
// INVESTMENTS
// =====================
export const investments = {
  getAll: () => api("/investment/user"),
  getById: (id: string) => api(`/investment/find?id=${id}`),
  create: (data: {
    plan: string;
    amount: number;
    type: string;
    symbol: string;
    name: string;
    percentageProfit: number;
    isRetirement?: boolean;
    retirementAccountType?: string;
  }) =>
    api("/investment/create", { method: "POST", body: JSON.stringify(data) }),
};

// =====================
// ASSETS
// =====================
export const assets = {
  getStocks: () => api("/assets/stocks"),
  getEtfs: () => api("/assets/etfs"),
};

// =====================
// WISHLIST
// =====================
export const wishlist = {
  getAll: () => api("/wishlist/user"),
  add: (assetId: string, assetType: string) =>
    api("/wishlist/create", {
      method: "POST",
      body: JSON.stringify({ assetId, assetType }),
    }),
  remove: (wishlistId: string) =>
    api("/wishlist/delete", {
      method: "POST",
      body: JSON.stringify({ wishlistId }),
    }),
};

// =====================
// KYC
// =====================
export const kyc = {
  submit: async (data: {
    documentType: string;
    documentNumber: string;
    document?: File;
    selfie?: File;
  }) => {
    const formData = new FormData();
    formData.append("documentType", data.documentType);
    formData.append("documentNumber", data.documentNumber);
    if (data.document) formData.append("document", data.document);
    if (data.selfie) formData.append("selfie", data.selfie);
    const token = getToken();
    const refreshToken = getRefreshToken();
    const response = await fetch(`${API_BASE}/kyc/create`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(refreshToken && { "x-refresh-token": refreshToken }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error("KYC submission failed");
    return response.json();
  },
  getStatus: () => api("/kyc/find"),
};

// =====================
// REFERRALS
// =====================
export const referrals = {
  getAll: () => api("/referral/all"),
};

// =====================
// MESSAGES
// =====================
export const messages = {
  getUser: () => api("/message/user"),
  getAdmin: () => api("/message/admin-user"),
  create: (data: { content: string }) =>
    api("/message", { method: "POST", body: JSON.stringify(data) }),
  markAsRead: (id: string) => api(`/message/mark-as-read?id=${id}`),
};

// =====================
// DASHBOARD (combined)
// =====================
export const getDashboard = async () => {
  const [profile, walletData, userInvestments] = await Promise.all([
    user.getProfile(),
    wallet.get(),
    investments.getAll(),
  ]);
  return {
    profile,
    wallet: walletData,
    investments: userInvestments,
    stats: null,
  };
};

// Export raw fetch for custom needs
export const apiFetch = api;
