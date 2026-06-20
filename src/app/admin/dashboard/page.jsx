import { cookies } from 'next/headers';
import {
	getDashboardStats,
	getRecentBookings,
	getWeeklyFlow,
} from '@/lib/services/analyticsService';
import AdminDashboardClient from '@/components/features/dashboard/AdminDashboardClient';

export default async function AdminDashboardPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

	let initialStats = null;
	let initialRecentBookings = null;
	let initialWeeklyFlow = null;

	try {
		const [statsRes, recentRes, weeklyRes] = await Promise.all([
			getDashboardStats(options),
			getRecentBookings(options),
			getWeeklyFlow(options),
		]);
		initialStats = statsRes;
		initialRecentBookings = recentRes;
		initialWeeklyFlow = weeklyRes;
	} catch (err) {
		console.error('Error pre-fetching dashboard data on server:', err);
		// Let client-side handle it if server fetch fails
	}

	return (
		<AdminDashboardClient
			initialStats={initialStats}
			initialRecentBookings={initialRecentBookings}
			initialWeeklyFlow={initialWeeklyFlow}
		/>
	);
}
