/**
 * API routes for SaloneVest backend integration
 */
import apiClient from './api-client';

export const API_ENDPOINTS = {
  // Investment endpoints
  getInvestments: "/api/investments",
  getInvestment: (id: string) => `/api/investments/${id}`,
  createInvestment: "/api/investments/transaction",

  // Portfolio endpoints
  getPortfolio: (walletAddress: string) => `/api/portfolio/${walletAddress}`,
  getHoldings: (walletAddress: string) => `/api/portfolio/${walletAddress}`,
  getPerformance: (walletAddress: string) => `/api/portfolio/${walletAddress}/performance`,
  getTransactionHistory: (walletAddress: string) => `/api/portfolio/${walletAddress}/transactions`,

  // User endpoints
  getProfile: (walletAddress: string) => `/api/user/${walletAddress}`,
  updateProfile: (walletAddress: string) => `/api/user/${walletAddress}`,

  // Balance endpoints
  getBalance: (walletAddress: string) => `/api/balance/${walletAddress}`,
  checkBalance: (walletAddress: string, amount: number) => `/api/balance/${walletAddress}/check?amount=${amount}`,

  // Admin endpoints
  admin: {
    stats: "/api/admin/stats",
    pendingInvestments: "/api/admin/investments/pending",
    approveInvestment: (id: string) => `/api/admin/investments/${id}/approve`,
    updateVetting: (id: string) => `/api/admin/investments/${id}/vetting`,
  },

  // Auth endpoints
  auth: {
    connect: "/api/auth/connect",
  }
}

// Authentication API calls

export async function authenticateWallet(publicKey: string, signature: string, message: string) {
  try {
    const response = await apiClient.post(API_ENDPOINTS.auth.connect, {
      publicKey,
      signature,
      message,
    });
    return response.data;
  } catch (error: any) {
    console.error("Auth error:", error);
    return { success: false, error: error.response?.data?.error || "Authentication failed" };
  }
}

// User API calls

export async function getUserProfile(walletAddress: string) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.getProfile(walletAddress));
    return response.data;
  } catch (error: any) {
    console.error("Get profile error:", error);
    return null;
  }
}

export async function updateUserProfile(walletAddress: string, profile: any, settings: any) {
  try {
    const response = await apiClient.put(API_ENDPOINTS.updateProfile(walletAddress), {
      profile,
      settings,
    });
    return response.data;
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: error.response?.data?.error || "Update failed" };
  }
}

// Investment API calls

export async function fetchInvestments(filters?: { type?: string; category?: string; risk?: string }) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.getInvestments, { params: filters });
    return response.data;
  } catch (error: any) {
    console.error("Fetch investments error:", error);
    return { success: false, investments: [] };
  }
}

export async function getInvestmentById(id: string) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.getInvestment(id));
    return response.data;
  } catch (error: any) {
    console.error("Get investment error:", error);
    return null;
  }
}

export async function submitInvestmentTransaction(
  walletAddress: string,
  investmentId: string,
  amount: number,
  txHash: string
) {
  try {
    const response = await apiClient.post(API_ENDPOINTS.createInvestment, {
      walletAddress,
      investmentId,
      amount,
      txHash,
    });
    return response.data;
  } catch (error: any) {
    console.error("Submit transaction error:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Transaction submission failed"
    };
  }
}

// Portfolio API calls

export async function getPortfolio(walletAddress: string) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.getPortfolio(walletAddress));
    return response.data;
  } catch (error: any) {
    console.error("Get portfolio error:", error);
    return null;
  }
}

export async function getPortfolioPerformance(walletAddress: string) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.getPerformance(walletAddress));
    return response.data;
  } catch (error: any) {
    console.error("Get performance error:", error);
    return { success: false, performance: [] };
  }
}

export async function getTransactionHistory(walletAddress: string) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.getTransactionHistory(walletAddress));
    return response.data;
  } catch (error: any) {
    console.error("Get transactions error:", error);
    return { success: false, transactions: [] };
  }
}

// Balance API calls

export async function getUSDCBalance(walletAddress: string) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.getBalance(walletAddress));
    return response.data;
  } catch (error: any) {
    console.error("Get balance error:", error);
    return { success: false, balance: 0 };
  }
}

export async function checkSufficientBalance(walletAddress: string, amount: number) {
  try {
    const response = await apiClient.get(API_ENDPOINTS.checkBalance(walletAddress, amount));
    return response.data;
  } catch (error: any) {
    console.error("Check balance error:", error);
    return { success: false, sufficient: false, balance: 0, shortfall: amount };
  }
}
