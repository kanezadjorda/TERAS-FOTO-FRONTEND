import { cookies } from 'next/headers';
import { format } from 'date-fns';
import CashierDashboardClient from '@/components/features/dashboard/CashierDashboardClient';

export default async function CashierPage({ searchParams }) {
	const resolvedSearchParams = await searchParams;
	const selectedDate = resolvedSearchParams?.date || format(new Date(), 'yyyy-MM-dd');

	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	let initialBookings = null;
	try {
		const res = await fetch(`http://localhost:3000/api/cashier/schedule?date=${selectedDate}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			cache: 'no-store',
		});
		if (res.ok) {
			const json = await res.json();
			initialBookings = json.data;
		}
	} catch (err) {
		console.error('Error pre-fetching cashier schedule:', err);
	}

	return (
		<CashierDashboardClient
			initialDate={selectedDate}
			initialBookings={initialBookings}
		/>
	);
}
