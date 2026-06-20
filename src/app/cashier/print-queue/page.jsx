import { cookies } from 'next/headers';
import { format } from 'date-fns';
import PrintQueueClient from '@/components/features/dashboard/PrintQueueClient';

export default async function PrintQueuePage({ searchParams }) {
	const resolvedSearchParams = await searchParams;
	const selectedDate = resolvedSearchParams?.date || format(new Date(), 'yyyy-MM-dd');

	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	let initialQueues = null;
	try {
		const res = await fetch(`http://localhost:3000/api/print-queues?date=${selectedDate}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			cache: 'no-store',
		});
		if (res.ok) {
			const json = await res.json();
			initialQueues = json.data;
		}
	} catch (err) {
		console.error('Error pre-fetching print queues on server:', err);
	}

	return <PrintQueueClient initialQueues={initialQueues} initialDate={selectedDate} />;
}
