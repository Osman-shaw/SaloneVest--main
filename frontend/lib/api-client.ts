import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        if (process.env.NODE_ENV === "development") {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const n = Number(error.response.status);
            // Never treat 4xx as a "server" error in the dev overlay; callers handle them
            if (!Number.isNaN(n) && n >= 500) {
                console.error("API Error:", n, error.response.data);
            }
        } else if (error.request) {
            console.error("Network Error: No response received");
        } else {
            console.error("Request Error:", error.message);
        }
        return Promise.reject(error);
    }
);

/** Typed helpers for the Express API (default `NEXT_PUBLIC_API_URL` / port 5000). */
export const api = {
    auth: {
        connect: (publicKey: string, signature: string, message: string) =>
            apiClient.post("/api/auth/connect", { publicKey, signature, message }),
    },
    user: {
        /** 404 = user not in DB yet (first visit); does not use the global error log path */
        get: (walletAddress: string, config?: AxiosRequestConfig) =>
            apiClient.get(`/api/user/${encodeURIComponent(walletAddress)}`, {
                ...config,
                validateStatus: (s) => s === 404 || (s >= 200 && s < 300),
            }),
        update: (
            walletAddress: string,
            body: { profile?: unknown; settings?: unknown }
        ) =>
            apiClient.put(`/api/user/${encodeURIComponent(walletAddress)}`, body),
    },
    portfolio: {
        get: (walletAddress: string) =>
            apiClient.get(`/api/portfolio/${encodeURIComponent(walletAddress)}`),
        getPerformance: (walletAddress: string) =>
            apiClient.get(
                `/api/portfolio/${encodeURIComponent(walletAddress)}/performance`
            ),
    },
} as const

export default apiClient
