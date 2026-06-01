import { getServiceById } from '@/lib/services/serviceService';
import ServiceDetail from '@/components/features/catalog/ServiceDetail';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
	const { id } = await params;
	try {
		const response = await getServiceById(id);
		const service = response?.data || response;

		if (!service) return { title: 'Layanan Tidak Ditemukan' };

		return {
			title: `${service.service_name} - Teras Foto Studio`,
			description: service.description || `Detail layanan ${service.service_name} di Teras Foto Studio.`,
		};
	} catch (error) {
		return { title: 'Detail Layanan - Teras Foto Studio' };
	}
}

export default async function ServiceDetailPage({ params }) {
	const { id } = await params;

	let service = null;
	try {
		const response = await getServiceById(id);
		// Handle both array response and object response containing data array
		service = response?.data || response;

		if (!service || (Array.isArray(service) && service.length === 0)) {
			notFound();
		}
	} catch (error) {
		console.error(`Failed to fetch service detail for ID ${id}:`, error);
		notFound();
	}

	return <ServiceDetail service={service} />;
}
