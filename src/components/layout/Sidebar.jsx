'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, CreditCard, Settings, Home } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		name: 'My Bookings',
		href: '/my-bookings',
		icon: CalendarDays,
	},
	{
		name: 'Payments',
		href: '/payments',
		icon: CreditCard,
	},
	{
		name: 'Settings',
		href: '/settings',
		icon: Settings,
	},
];

export function Sidebar() {
	const pathname = usePathname();
	const { user } = useAuth();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsMounted(true), 0);
		return () => clearTimeout(timer);
	}, []);

	const getInitials = name => {
		if (!name) return 'U';
		const words = name.trim().split(/\s+/);
		if (words.length >= 2) {
			return `${words[0][0]}${words[1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	const userName = user?.full_name || user?.name || 'User';

	return (
		<aside className="font-poppins w-full md:w-[300px] h-screen bg-[#F3F3F4] p-8 flex flex-col gap-8 sticky top-0">
			<div className="flex flex-col gap-4">
				<h2 className="font-poppins font-bold text-[24px] text-[#705D00] leading-[31.2px] tracking-[-0.24px]">
					My Teras
				</h2>
				<div className="bg-[#FFD700]/50 rounded-[20px] p-4 flex items-center gap-4">
					<div className="w-10 h-10 bg-[#4D4732] rounded-full flex-shrink-0 flex items-center justify-center">
						<span className="font-inter font-bold text-[14px] text-white">
							{isMounted ? getInitials(userName) : 'U'}
						</span>
					</div>
					<span
						className="font-inter font-medium text-[16px] text-[#4D4732] truncate"
						title={isMounted ? userName : 'User'}>
						{isMounted ? userName : 'User'}
					</span>
				</div>
			</div>

			<nav className="flex flex-col gap-2">
				{navItems.map(item => {
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
					const Icon = item.icon;

					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								'flex items-center gap-4 px-6 py-4 rounded-[20px] transition-colors font-inter font-medium text-[16px]',
								isActive ? 'bg-white text-[#70621F] shadow-sm' : 'text-[#4D4732] hover:bg-white/50',
							)}>
							<Icon className="w-6 h-6" />
							{item.name}
						</Link>
					);
				})}
			</nav>

			<div className="mt-auto flex flex-col gap-2">
				<Link
					href="/"
					className="flex items-center gap-4 px-6 py-4 rounded-[20px] transition-colors font-inter font-medium text-[16px] text-[#4D4732] hover:bg-white/50">
					<Home className="w-6 h-6" />
					Beranda
				</Link>
			</div>
		</aside>
	);
}
