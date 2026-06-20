import { cookies } from 'next/headers';
import ReschedulesClient from '@/components/features/dashboard/ReschedulesClient';

export default async function ReschedulesPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	let initialReschedules = null;
	try {
		const res = await fetch('http://localhost:3000/api/cashier/reschedules', {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			cache: 'no-store',
		});
		if (res.ok) {
			const json = await res.json();
			initialReschedules = json.data;
		}
	} catch (err) {
		console.error('Error pre-fetching reschedules on server:', err);
	}

	return <ReschedulesClient initialReschedules={initialReschedules} />;
}
