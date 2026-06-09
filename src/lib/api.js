import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Kelas Error Kustom untuk menangani error API dengan kode status dan data respons
 */
export class ApiError extends Error {
	constructor(message, status, data) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

/**
 * Handler permintaan inti yang membungkus fetch bawaan (native fetch)
 */
async function request(endpoint, options = {}) {
	const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

	// Atur header
	const headers = {
		...options.headers,
	};

	// Hanya atur Content-Type ke application/json jika body bukan FormData dan body ada
	if (options.body && !(options.body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
	}

	// Jika token tidak disediakan di header, coba ambil dari js-cookie (hanya di sisi klien)
	if (!headers['Authorization']) {
		if (typeof window !== 'undefined') {
			const token = Cookies.get('token');
			if (token) {
				headers['Authorization'] = `Bearer ${token}`;
			}
		}
	}

	const config = {
		...options,
		headers,
	};

	try {
		const response = await fetch(url, config);

		// Urai body respons jika ada
		let data = null;
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			data = await response.json();
		} else {
			data = await response.text();
		}

		if (!response.ok) {
			// Ambil pesan error dari respons backend jika tersedia
			const errorMessage =
				data?.message || data?.error || `Permintaan gagal dengan status ${response.status}`;
			throw new ApiError(errorMessage, response.status, data);
		}

		return data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		// Tangani kesalahan jaringan atau kesalahan tak terduga lainnya
		throw new Error(error.message || 'Terjadi kesalahan jaringan');
	}
}

export const api = {
	get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
	post: (endpoint, body, options = {}) =>
		request(endpoint, {
			...options,
			method: 'POST',
			body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
		}),
	put: (endpoint, body, options = {}) =>
		request(endpoint, {
			...options,
			method: 'PUT',
			body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
		}),
	delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
