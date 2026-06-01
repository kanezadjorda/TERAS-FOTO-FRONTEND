import { HeroSection } from '@/components/features/HeroSection';
import { ServicesSection } from '@/components/features/ServicesSection';

export default function Home() {
	return (
		<main className="flex flex-col min-h-screen bg-white">
			<HeroSection />
			<ServicesSection />
		</main>
	);
}
