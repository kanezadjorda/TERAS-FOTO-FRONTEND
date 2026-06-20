import { cookies } from 'next/headers';
import AdminServicesClient from '@/components/features/services/AdminServicesClient';

export default async function AdminServicesPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	let initialServices = [];
	try {
		const res = await fetch('http://localhost:3000/api/admin/services', {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			cache: 'no-store', // SSR real-time
		});
		if (res.ok) {
			const json = await res.json();
			initialServices = json.data;
		}
	} catch (err) {
		console.error('Error pre-fetching services on server:', err);
	}

	return <AdminServicesClient initialServices={initialServices} />;
}
