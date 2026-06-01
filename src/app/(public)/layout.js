import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({ children }) {
	return (
		<div className="flex flex-col min-h-screen bg-white">
			<Navbar />
			<div className="grow">{children}</div>
			<Footer />
		</div>
	);
}
