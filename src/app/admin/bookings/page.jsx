import { cookies } from 'next/headers';
import { getAllBookingsAdmin, getBookingStats } from '@/lib/services/bookingService';
import AdminBookingsClient from '@/components/features/booking/AdminBookingsClient';

export default async function AdminBookingsPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

	let initialBookings = null;
	let initialStats = null;

	try {
		const [bookingsRes, statsRes] = await Promise.all([
			getAllBookingsAdmin({ page: 1, limit: 10 }, options),
			getBookingStats(options),
		]);
		initialBookings = bookingsRes;
		initialStats = statsRes;
	} catch (err) {
		console.error('Error pre-fetching admin bookings on server:', err);
	}

	return (
		<AdminBookingsClient
			initialBookings={initialBookings}
			initialStats={initialStats}
		/>
	);
}
