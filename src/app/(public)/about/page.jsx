import AboutHero from '@/components/features/about/AboutHero';
import TeamSection from '@/components/features/about/TeamSection';
import ContactInfo from '@/components/features/about/ContactInfo';

export const metadata = {
	title: 'About Us | Teras Foto Studio',
	description: 'Mengenal lebih dekat tim dan sejarah Teras Foto Studio.',
};

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-white mt-5">
			<AboutHero />
			<TeamSection />
			<ContactInfo />
		</main>
	);
}
