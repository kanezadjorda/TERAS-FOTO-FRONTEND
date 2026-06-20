import { cookies } from 'next/headers';
import { getAdminRooms } from '@/lib/services/roomService';
import AdminRoomsClient from '@/components/features/rooms/AdminRoomsClient';

export default async function AdminRoomsPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

	let initialRooms = null;
	try {
		initialRooms = await getAdminRooms(options);
	} catch (err) {
		console.error('Error pre-fetching admin rooms on server:', err);
	}

	return <AdminRoomsClient initialRooms={initialRooms} />;
}
