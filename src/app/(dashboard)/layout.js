import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }) {
	return (
		<div className="flex flex-col min-h-screen bg-[#E2E2E2]">
			<div className="flex grow mx-auto w-full">
				<Sidebar />
				<main className="flex-1 bg-white rounded-tl-[40px] p-8 md:p-12 overflow-hidden">
					{children}
				</main>
			</div>
		</div>
	);
}
