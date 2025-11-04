import axios, { AxiosError, AxiosInstance } from 'axios';

const baseURL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || '/api';

const api: AxiosInstance = axios.create({
	baseURL,
	timeout: 30000,
	headers: { 'Content-Type': 'application/json' },
});

function getToken(): string | null {
	try {
		return localStorage.getItem('jhi-authenticationToken');
	} catch {
		return null;
	}
}

api.interceptors.request.use(config => {
	const token = getToken();
	if (token) {
		config.headers = config.headers ?? {};
		(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	response => response,
	(error: AxiosError<any>) => {
		// Handle network errors (no response from server)
		if (!error.response) {
			// Network error - server unreachable or no internet
			if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
				console.warn('Request timeout - backend might not be running. This is expected in demo mode.');
				// For demo mode, we'll silently fail instead of showing error
				// In production, you would show a proper error message here
			} else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
				console.warn('Network error - backend not available. This is expected in demo mode with mock data.');
				// For demo mode with mock data, we suppress network errors
			}
			// Don't reject for network errors in demo mode - let components handle it
			// Return a mock response structure so the app doesn't break
			return Promise.reject(error);
		}
		
		const status = error.response?.status;
		if (status === 401) {
			if (typeof window !== 'undefined') window.location.href = '/login';
		} else if (status === 403) {
			// Replace with your toast system when available
			console.error('Access denied');
		} else if (status && status >= 500) {
			console.error('Server error');
		}
		return Promise.reject(error);
	}
);

export default api;
