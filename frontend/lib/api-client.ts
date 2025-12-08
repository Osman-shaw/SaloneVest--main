import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

console.log('🔧 API Client initialized with baseURL:', API_BASE_URL);

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Create axios instance with extended timeout
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // Increased from 10s to 15s
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function for exponential backoff retry
async function retryRequest(
    config: AxiosRequestConfig,
    retries: number = MAX_RETRIES
): Promise<AxiosResponse> {
    try {
        return await apiClient.request(config);
    } catch (error: any) {
        // Don't retry on 4xx errors (except 408, 429)
        if (error.response && error.response.status >= 400 && error.response.status < 500 
            && error.response.status !== 408 && error.response.status !== 429) {
            throw error;
        }

        // Retry on network errors, timeouts, or 5xx errors
        if (retries > 0 && (
            !error.response || 
            error.code === 'ECONNABORTED' || 
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT' ||
            error.response.status === 408 ||
            error.response.status === 429 ||
            error.response.status >= 500
        )) {
            const delayMs = RETRY_DELAY * (MAX_RETRIES - retries + 1);
            console.warn(`⚠️  Request failed, retrying in ${delayMs}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            return retryRequest(config, retries - 1);
        }

        throw error;
    }
}

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] API Request: ${config.method?.toUpperCase()} ${API_BASE_URL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Setup Error:', error.message);
        return Promise.reject(error);
    }
);

// Response interceptor with improved error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.statusText}`);
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data = error.response.data;
            console.error(`❌ API Error [${status}]:`, data);
            
            // Add helpful context
            if (status === 404) {
                console.error('💡 Endpoint not found. Check if backend is running and endpoint is correct.');
            } else if (status === 503) {
                console.error('💡 Service unavailable. Backend may be starting up.');
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('❌ Network Error: No response received from backend');
            console.error('💡 This usually means:');
            console.error('   - Backend server is not running (cd backend && npm start)');
            console.error('   - Backend is unreachable at:', API_BASE_URL);
            console.error('   - Network/firewall is blocking the connection');
            console.error('   - Backend is still starting up (wait a few seconds and retry)');
            console.error('💡 Visit http://localhost:3000/debug to diagnose');
        } else {
            // Error in request setup
            console.error('❌ Request Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// API Methods with automatic retry
export const api = {
    auth: {
        connect: (publicKey: string, signature: string, message: string) =>
            retryRequest({
                method: 'post',
                url: '/api/auth/connect',
                data: { publicKey, signature, message }
            }),
    },
    user: {
        get: (walletAddress: string) => 
            retryRequest({ method: 'get', url: `/api/user/${walletAddress}` }),
        getAll: () => 
            retryRequest({ method: 'get', url: '/api/user' }),
        update: (walletAddress: string, data: any) => 
            retryRequest({ method: 'put', url: `/api/user/${walletAddress}`, data }),
    },
    portfolio: {
        get: (walletAddress: string) => 
            retryRequest({ method: 'get', url: `/api/portfolio/${walletAddress}` }),
        getPerformance: (walletAddress: string) => 
            retryRequest({ method: 'get', url: `/api/portfolio/${walletAddress}/performance` }),
        getTransactions: (walletAddress: string) => 
            retryRequest({ method: 'get', url: `/api/portfolio/${walletAddress}/transactions` }),
    },
    balance: {
        get: (walletAddress: string) => 
            retryRequest({ method: 'get', url: `/api/balance/${walletAddress}` }),
    },
    investments: {
        getAll: () => 
            retryRequest({ method: 'get', url: '/api/investments' }),
        getById: (id: string) => 
            retryRequest({ method: 'get', url: `/api/investments/${id}` }),
    }
};

export default apiClient;
