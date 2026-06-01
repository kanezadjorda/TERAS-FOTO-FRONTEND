'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	LayoutGrid,
	Calendar,
	Clock,
	BarChart3,
	Settings,
	Home,
	LogOut,
	Camera,
	DoorOpen,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const adminNavItems = [
	{
		name: 'Dashboard',
		href: '/admin/dashboard',
		icon: LayoutGrid,
	},
	{
		name: 'Bookings',
		href: '/admin/bookings',
		icon: Calendar,
	},
	{
		name: 'Services',
		href: '/admin/services',
		icon: Camera,
	},
	{
		name: 'Rooms',
		href: '/admin/rooms',
		icon: DoorOpen,
	},
	{
		name: 'Schedule',
		href: '/admin/schedule',
		icon: Clock,
	},
	{
		name: 'Analytics',
		href: '/admin/analytics',
		icon: BarChart3,
	},
	{
		name: 'Settings',
		href: '/admin/settings',
		icon: Settings,
	},
];

export function AdminSidebar() {
	const pathname = usePathname();
	const { logout } = useAuth();

	return (
		<aside className="w-full md:w-[280px] h-screen bg-[#F5F5F5] p-6 flex flex-col justify-between sticky top-0 border-r border-gray-100">
			<div className="flex flex-col gap-8">
				{/* Logo & Branding */}
				<div className="flex flex-col gap-4 pl-2">
					<div className="relative w-[120px] h-[50px]">
						<Image
							src="/images/logo-435822.png"
							alt="Teras Foto Logo"
							fill
							sizes="120px"
							className="object-contain object-left"
							onError={e => {
								// Fallback jika logo tidak ada
								e.target.src =
									"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' fill='%23705D00'%3E%3Ctext x='10' y='25' font-family='sans-serif' font-weight='bold' font-size='18'%3Etq%3C/text%3E%3C/svg%3E";
							}}
						/>
					</div>
					<div className="flex flex-col">
						<h2 className="font-poppins font-bold text-[20px] text-[#705D00] leading-tight">
							My Teras
						</h2>
						<span className="font-inter text-[12px] text-gray-400 font-medium mt-0.5">
							Creative Member
						</span>
					</div>
				</div>

				{/* Navigation Menu */}
				<nav className="flex flex-col gap-1.5">
					{adminNavItems.map(item => {
						const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
						const Icon = item.icon;

						return (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									'flex items-center gap-4 px-4 py-3 rounded-[16px] transition-all font-poppins font-bold text-sm tracking-wide',
									isActive
										? 'bg-[#F9E485] text-[#4D4732] shadow-sm'
										: 'text-gray-500 hover:bg-gray-100/60 hover:text-gray-800',
								)}>
								<Icon className={cn('w-5 h-5', isActive ? 'text-[#4D4732]' : 'text-gray-400')} />
								{item.name}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Bottom Actions */}
			<div className="flex flex-col gap-1.5 border-t border-gray-200/60 pt-4">
				<Link
					href="/"
					className="flex items-center gap-4 px-4 py-3 rounded-[16px] text-gray-500 hover:bg-gray-100/60 hover:text-gray-800 transition-all font-poppins font-bold text-xs tracking-wide">
					<Home className="w-4 h-4 text-gray-400" />
					Beranda
				</Link>
				<button
					onClick={logout}
					className="flex items-center gap-4 px-4 py-3 rounded-[16px] text-red-600 hover:bg-red-50 transition-all font-poppins font-bold text-xs tracking-wide w-full text-left">
					<LogOut className="w-4 h-4 text-red-400" />
					Keluar
				</button>
			</div>
		</aside>
	);
}
