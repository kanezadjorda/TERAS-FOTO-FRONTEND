import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMyBookingHistory } from '@/lib/services/bookingService';
import MyBookingsClient from './MyBookingsClient';

export const metadata = {
	title: 'Riwayat Pesanan - Teras Foto Studio',
	description:
		'Pantau status sesi foto kamu, lakukan pembayaran, batalkan pesanan, atau ajukan perubahan jadwal.',
};

export default async function MyBookingsPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	if (!token) {
		redirect('/login?redirect=/my-bookings');
	}

	let initialBookings = [];
	let error = null;

	try {
		// Fetch initial data on the server
		const response = await getMyBookingHistory({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		});

		if (response.success) {
			initialBookings = response.data;
		} else {
			error = response.message || 'Gagal mengambil data';
		}
	} catch (err) {
		console.error('Error fetching bookings on server:', err);
		error = err.message || 'Terjadi kesalahan saat mengambil data';
	}

	return <MyBookingsClient initialBookings={initialBookings} initialError={error} />;
}
