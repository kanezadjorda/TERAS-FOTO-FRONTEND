import { getAllServices } from '@/lib/services/serviceService';
import CatalogGrid from '@/components/features/catalog/CatalogGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
	title: 'Katalog Layanan - Teras Foto Studio',
	description:
		'Temukan berbagai paket foto terbaik dari Teras Foto Studio. Mulai dari self-photo, maternity, wisuda, hingga foto keluarga dengan harga terjangkau dan kualitas profesional.',
	openGraph: {
		title: 'Katalog Layanan - Teras Foto Studio',
		description:
			'Temukan berbagai paket foto terbaik dari Teras Foto Studio. Mulai dari self-photo, maternity, wisuda, hingga foto keluarga dengan harga terjangkau dan kualitas profesional.',
	},
};

export default async function CatalogPage() {
	// Fetch services directly on the server
	let services = [];
	try {
		const response = await getAllServices();
		// Handle both array response and object response containing data array
		services = Array.isArray(response) ? response : response?.data || [];
	} catch (error) {
		console.error('Failed to fetch services for catalog:', error);
		// Fallback to empty array so the page doesn't crash completely
		services = [];
	}

	return <CatalogGrid initialServices={services} />;
}
