'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, Printer, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const menuItems = [
	{
		title: 'Jadwal Harian',
		href: '/cashier',
		icon: Calendar,
	},
	{
		title: 'Persetujuan Reschedule',
		href: '/cashier/reschedules',
		icon: Clock,
	},
	{
		title: 'Antrean Cetak',
		href: '/cashier/print-queue',
		icon: Printer,
	},
];

export default function CashierSidebar() {
	const pathname = usePathname();
	const { logout } = useAuth();

	return (
		<aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
			<div className="p-6 border-b border-gray-200">
				<h1 className="text-2xl font-bold text-gray-900">Teras Foto</h1>
				<p className="text-sm text-gray-500 mt-1">Cashier Dashboard</p>
			</div>

			<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
				{menuItems.map(item => {
					const isActive = pathname === item.href;
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
								isActive
									? 'bg-primary-50 text-primary-700'
									: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
							)}>
							<Icon className={cn('w-5 h-5', isActive ? 'text-primary-700' : 'text-gray-400')} />
							{item.title}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-gray-200">
				<button
					onClick={logout}
					className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
					<LogOut className="w-5 h-5" />
					Logout
				</button>
			</div>
		</aside>
	);
}
