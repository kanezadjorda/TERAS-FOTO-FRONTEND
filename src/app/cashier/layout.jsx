import CashierSidebar from '@/components/layout/CashierSidebar';

export const metadata = {
	title: 'Cashier Dashboard - Teras Foto',
	description: 'Dashboard untuk kasir Teras Foto',
};

export default function CashierLayout({ children }) {
	return (
		<div className="flex min-h-screen bg-gray-50">
			<CashierSidebar />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
