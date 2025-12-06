import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

console.log('🔧 API Client initialized with baseURL:', API_BASE_URL);

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
        // You can add auth tokens here if needed
        console.log(`API Base URL: ${API_BASE_URL}`);
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
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
            // Server responded with error
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error: No response received');
        } else {
            // Error in request setup
            console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// API Methods
export const api = {
    auth: {
        connect: (publicKey: string, signature: string, message: string) =>
            apiClient.post('/api/auth/connect', { publicKey, signature, message }),
    },
    user: {
        get: (walletAddress: string) => apiClient.get(`/api/user/${walletAddress}`),
        getAll: () => apiClient.get('/api/user'),
        update: (walletAddress: string, data: any) => apiClient.put(`/api/user/${walletAddress}`, data),
    },
    portfolio: {
        get: (walletAddress: string) => apiClient.get(`/api/portfolio/${walletAddress}`),
        getPerformance: (walletAddress: string) => apiClient.get(`/api/portfolio/${walletAddress}/performance`),
        getTransactions: (walletAddress: string) => apiClient.get(`/api/portfolio/${walletAddress}/transactions`),
    },
    balance: {
        get: (walletAddress: string) => apiClient.get(`/api/balance/${walletAddress}`),
    },
    investments: {
        getAll: () => apiClient.get('/api/investments'),
        getById: (id: string) => apiClient.get(`/api/investments/${id}`),
    }
};

export default apiClient;
