import { NextResponse } from 'next/server';

/**
 * Fungsi pembantu untuk mendekode payload JWT secara aman di Edge Middleware
 */
function decodeJwt(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		// Menggunakan atob bawaan Edge runtime
		const jsonPayload = atob(base64);
		return JSON.parse(jsonPayload);
	} catch (error) {
		return null;
	}
}

export function middleware(request) {
	const token = request.cookies.get('token')?.value;
	const { pathname } = request.nextUrl;

	// Dekode token jika ada untuk mendapatkan role_id
	const user = token ? decodeJwt(token) : null;
	const roleId = user?.role_id;

	// Rute yang dilindungi
	const isCustomerProtectedRoute =
		pathname.startsWith('/my-bookings') || pathname.startsWith('/booking');
	const isInternalProtectedRoute =
		(pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) ||
		pathname.startsWith('/cashier');

	// Rute autentikasi (login, register, admin-login)
	const isAuthRoute =
		pathname.startsWith('/login') ||
		pathname.startsWith('/register') ||
		pathname.startsWith('/admin-login');

	// 1. Jika mencoba mengakses rute customer yang dilindungi tapi belum login
	if (isCustomerProtectedRoute && !token) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(loginUrl);
	}

	// 2. Jika mencoba mengakses rute internal (admin/cashier) tapi belum login
	if (isInternalProtectedRoute && !token) {
		const loginUrl = new URL('/admin-login', request.url);
		loginUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(loginUrl);
	}

	// 3. Jika sudah login, lakukan pengecekan otorisasi role
	if (token && roleId) {
		// Admin/Cashier (role_id 1 atau 2) mencoba mengakses rute customer yang dilindungi (seperti booking atau my-bookings)
		if ((roleId === 1 || roleId === 2) && isCustomerProtectedRoute) {
			const redirectUrl = roleId === 1 ? '/admin/dashboard' : '/cashier';
			return NextResponse.redirect(new URL(redirectUrl, request.url));
		}

		// Customer (role_id 3) mencoba mengakses rute internal (admin/cashier)
		if (roleId === 3 && isInternalProtectedRoute) {
			return NextResponse.redirect(new URL('/', request.url));
		}

		// Jika sudah login dan mencoba mengakses rute auth (login/register/admin-login)
		if (isAuthRoute) {
			if (roleId === 1) {
				return NextResponse.redirect(new URL('/admin/dashboard', request.url));
			} else if (roleId === 2) {
				return NextResponse.redirect(new URL('/cashier', request.url));
			} else {
				return NextResponse.redirect(new URL('/', request.url));
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/my-bookings/:path*',
		'/booking/:path*',
		'/admin/:path*',
		'/cashier/:path*',
		'/login',
		'/register',
		'/admin-login',
	],
};
