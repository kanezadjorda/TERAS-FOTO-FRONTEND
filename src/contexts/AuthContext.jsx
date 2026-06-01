'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

const AuthContext = createContext(null);

/**
 * Fungsi pembantu untuk mendekode payload JWT secara aman di browser
 */
function decodeJwt(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join(''),
		);
		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error('Gagal mendekode token JWT:', error);
		return null;
	}
}

export function AuthProvider({ children }) {
	// Inisialisasi state langsung dari cookie untuk menghindari peringatan render bertingkat (cascading render) dari useEffect setState
	const [user, setUser] = useState(() => {
		if (typeof window === 'undefined') return null;
		const token = Cookies.get('token');
		if (token) {
			const decoded = decodeJwt(token);
			if (decoded) {
				const currentTime = Date.now() / 1000;
				if (decoded.exp && decoded.exp < currentTime) {
					Cookies.remove('token');
					return null;
				}
				return decoded;
			}
			Cookies.remove('token');
		}
		return null;
	});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	/**
	 * Masuk (Login) pengguna
	 */
	const login = async (email, password, isAdminLogin = false) => {
		try {
			const response = await api.post('/auth/login', { email, password });
			const token = response.data?.token;

			if (!token) {
				throw new Error('Tidak ada token yang diterima dari server');
			}

			// Dekode token terlebih dahulu untuk memeriksa role
			const decoded = decodeJwt(token);

			// Jika login dari portal admin, pastikan role adalah Owner (1) atau Cashier (2)
			if (isAdminLogin && decoded?.role_id === 3) {
				throw new Error('Akses ditolak. Akun ini tidak memiliki hak akses pegawai.');
			}

			// Jika login dari portal customer biasa, pastikan role adalah Customer (3)
			if (!isAdminLogin && (decoded?.role_id === 1 || decoded?.role_id === 2)) {
				throw new Error('Akses ditolak. Silakan gunakan portal admin untuk login.');
			}

			// Simpan token ke cookie (kedaluwarsa dalam 7 hari)
			Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });

			// Atur state pengguna
			setUser(decoded);

			// Alihkan halaman berdasarkan role_id
			// role_id === 1: Owner/Admin -> /admin/dashboard
			// role_id === 2: Cashier -> /cashier
			// role_id === 3: Customer -> /
			if (decoded?.role_id === 1) {
				router.push('/admin/dashboard');
			} else if (decoded?.role_id === 2) {
				router.push('/cashier');
			} else {
				router.push('/');
			}

			return response;
		} catch (error) {
			throw error;
		}
	};

	/**
	 * Masuk (Login) dengan Google
	 */
	const loginWithGoogle = async credential => {
		try {
			const response = await api.post('/auth/google', { credential });
			const token = response.data?.token;

			if (!token) {
				throw new Error('Tidak ada token yang diterima dari server');
			}

			// Dekode token
			const decoded = decodeJwt(token);

			// Simpan token ke cookie (kedaluwarsa dalam 7 hari)
			Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });

			// Atur state pengguna
			setUser(decoded);

			// Alihkan halaman ke beranda (Google login hanya untuk customer)
			router.push('/');

			return response;
		} catch (error) {
			console.error('Google login error:', error);
			throw error;
		}
	};

	/**
	 * Daftar (Register) pengguna baru
	 */
	const register = async (fullName, email, password) => {
		try {
			const response = await api.post('/auth/register', {
				full_name: fullName,
				email,
				password,
			});
			return response;
		} catch (error) {
			throw error;
		}
	};

	/**
	 * Keluar (Logout) pengguna
	 */
	const logout = () => {
		Cookies.remove('token');
		setUser(null);
		router.push('/login');
	};

	const value = {
		user,
		loading,
		login,
		loginWithGoogle,
		register,
		logout,
		isAuthenticated: !!user,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
