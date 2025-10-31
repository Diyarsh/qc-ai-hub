import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface User {
	id: string;
	login: string;
	email: string;
	roles: string[];
	authorities: string[];
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isAdmin: boolean;
	isSuperAdmin: boolean;
	loading: boolean;
	hasRole: (role: string) => boolean;
	hasAuthority: (authority: string) => boolean;
	setToken: (token: string | null) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function safeJwtParse<T = Record<string, unknown>>(token: string): T | null {
	try {
		const parts = token.split('.');
		if (parts.length < 2) return null;
		const payload = parts[1]
			.replace(/-/g, '+')
			.replace(/_/g, '/');
		const json = decodeURIComponent(
			atob(payload)
				.split('')
				.map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join('')
		);
		return JSON.parse(json) as T;
	} catch {
		return null;
	}
}

function extractUserFromToken(token: string): { user: User | null; isExpired: boolean } {
	const payload = safeJwtParse<{ sub?: string; email?: string; auth?: string; roles?: string[]; authorities?: string[]; exp?: number; preferred_username?: string }>(token);
	if (!payload) return { user: null, isExpired: true };
	const expSec = payload.exp ?? 0;
	const isExpired = expSec * 1000 <= Date.now();
	const authorities = Array.isArray(payload.authorities)
		? payload.authorities
		: typeof payload.auth === 'string'
			? payload.auth.split(',').map(s => s.trim()).filter(Boolean)
			: [];
	const roles = Array.isArray(payload.roles)
		? payload.roles
		: Array.isArray(authorities) 
			? authorities.filter(a => typeof a === 'string' && a.startsWith('ROLE_'))
			: [];
	const login = (payload.preferred_username || payload.sub || '').toString();
	const email = (payload.email || '').toString();
	const user: User = {
		id: payload.sub ? String(payload.sub) : login || 'unknown',
		login,
		email,
		roles: Array.isArray(roles) ? roles : [],
		authorities: Array.isArray(authorities) ? authorities : [],
	};
	return { user, isExpired };
}

const TOKEN_STORAGE_KEY = 'jhi-authenticationToken';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setTokenState] = useState<string | null>(() => {
		return localStorage.getItem(TOKEN_STORAGE_KEY);
	});
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const setToken = useCallback((next: string | null) => {
		if (next) {
			localStorage.setItem(TOKEN_STORAGE_KEY, next);
		} else {
			localStorage.removeItem(TOKEN_STORAGE_KEY);
		}
		setTokenState(next);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUser(null);
	}, [setToken]);

	useEffect(() => {
		setLoading(true);
		if (!token) {
			setUser(null);
			setLoading(false);
			return;
		}
		const { user: parsedUser, isExpired } = extractUserFromToken(token);
		if (!parsedUser || isExpired) {
			logout();
			setLoading(false);
			return;
		}
		setUser(parsedUser);
		setLoading(false);
	}, [token, logout]);

	const isAuthenticated = Boolean(user);
	const isAdmin = useMemo(() => (user?.roles || user?.authorities || []).includes('ROLE_ADMIN'), [user]);
	const isSuperAdmin = useMemo(() => (user?.roles || user?.authorities || []).includes('ROLE_SUPER_ADMIN'), [user]);

	const hasRole = useCallback((role: string) => {
		if (!user) return false;
		const roles = user.roles || [];
		const authorities = user.authorities || [];
		return roles.includes(role) || authorities.includes(role);
	}, [user]);

	const hasAuthority = useCallback((authority: string) => {
		if (!user) return false;
		const authorities = user.authorities || [];
		return authorities.includes(authority);
	}, [user]);

	const value: AuthContextType = {
		user,
		isAuthenticated,
		isAdmin,
		isSuperAdmin,
		loading,
		hasRole,
		hasAuthority,
		setToken,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
