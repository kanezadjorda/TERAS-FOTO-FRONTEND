import PortofolioClient from '@/components/features/catalog/PortofolioClient';

export default async function PortofolioPage() {
	let initialItems = null;

	try {
		// Native Next.js fetch with ISR/caching strategy as requested in Task 1.3
		const res = await fetch('http://localhost:3000/api/portofolio', {
			next: { revalidate: 60 },
		});
		if (res.ok) {
			const data = await res.json();
			initialItems = data.data || data;
		}
	} catch (err) {
		console.warn('Backend portfolio API not available, falling back to static items:', err.message);
	}

	return <PortofolioClient initialItems={initialItems} />;
}
