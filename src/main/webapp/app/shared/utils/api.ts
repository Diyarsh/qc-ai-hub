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
