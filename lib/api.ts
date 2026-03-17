const API_BASE = 'http://localhost:5000/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

// Auth
export const register = (data: { email: string; password: string; firstName?: string; lastName?: string; phone?: string }) =>
  apiFetch('/register', { method: 'POST', body: JSON.stringify(data) });

export const login = (data: { email: string; password: string }) =>
  apiFetch('/login', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getDashboard = () => apiFetch('/dashboard');

// Deposit
export const deposit = (data: { amount: number; method: string }) =>
  apiFetch('/deposit', { method: 'POST', body: JSON.stringify(data) });
