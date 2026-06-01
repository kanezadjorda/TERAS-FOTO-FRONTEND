'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

export function NavbarActions() {
	const { user, logout } = useAuth();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const dropdownRef = useRef(null);
	const mobileMenuRef = useRef(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Close dropdowns when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
			if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
				// Only close if we didn't click the hamburger button itself
				const hamburgerBtn = document.getElementById('hamburger-btn');
				if (hamburgerBtn && !hamburgerBtn.contains(event.target)) {
					setIsMobileMenuOpen(false);
				}
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Helper to get initials for avatar
	const getInitial = name => {
		if (!name) return 'U';
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	if (!isMounted) return null;

	return (
		<>
			{/* Action Button / Icon (Desktop) */}
			<div className="hidden md:flex items-center gap-4 font-poppins">
				{!user ? (
					<div className="flex items-center gap-3">
						<Link
							href="/login"
							className="text-sm font-semibold text-[#705D00] hover:opacity-80 transition-opacity px-4 py-2 focus-visible:ring-2 focus-visible:ring-[#705D00] focus:outline-none rounded-lg">
							Sign In
						</Link>
						<Link
							href="/register"
							className="text-sm font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all px-5 py-2.5 rounded-[20px] shadow-sm focus-visible:ring-2 focus-visible:ring-[#705D00] focus:outline-none">
							Register
						</Link>
					</div>
				) : (
					<div className="relative flex items-center gap-4">
						{/* Dashboard Button */}
						<Link
							href={
								user.role_id === 1
									? '/admin/dashboard'
									: user.role_id === 2
										? '/cashier'
										: '/my-bookings'
							}
							className="text-sm font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all px-5 py-2.5 rounded-[20px] shadow-sm focus-visible:ring-2 focus-visible:ring-[#705D00] focus:outline-none">
							{user.role_id === 1 || user.role_id === 2 ? 'Dashboard' : 'My Bookings'}
						</Link>

						{/* Avatar & Dropdown */}
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="w-10 h-10 rounded-full bg-[#705D00] text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-md hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]"
								aria-label="User menu"
								aria-expanded={isDropdownOpen}>
								{getInitial(user.full_name || user.name || user.email)}
							</button>

							{isDropdownOpen && (
								<div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg border border-[#F1EEE6] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
									<div className="px-4 py-2.5 border-b border-[#F1EEE6]">
										<p className="text-xs font-semibold text-[#7E775F] uppercase tracking-wider">
											Logged in as
										</p>
										<p className="text-sm font-bold text-[#1A1C1C] truncate mt-0.5">
											{user.full_name || user.name || 'User'}
										</p>
										<p className="text-xs text-[#4D4732] truncate">{user.email}</p>
									</div>
									<button
										onClick={() => {
											setIsDropdownOpen(false);
											logout();
										}}
										className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors focus:outline-none focus-visible:bg-red-50">
										Sign Out
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Hamburger Menu Button (Mobile) */}
			<div className="flex md:hidden items-center">
				<button
					id="hamburger-btn"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="p-1 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg"
					aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
					aria-expanded={isMobileMenuOpen}>
					{isMobileMenuOpen ? (
						<X className="w-8 h-8 text-black" strokeWidth={2.5} />
					) : (
						<Menu className="w-8 h-8 text-black" strokeWidth={2.5} />
					)}
				</button>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMobileMenuOpen && (
				<div
					ref={mobileMenuRef}
					className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white rounded-[24px] shadow-lg border border-[#F1EEE6] p-6 z-50 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
					{/* Navigation Links */}
					<nav className="flex flex-col gap-4">
						<Link
							href="/catalog"
							onClick={() => setIsMobileMenuOpen(false)}
							className="text-base font-medium text-black/70 hover:text-black transition-colors font-poppins py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg px-2">
							Catalog
						</Link>
						<Link
							href="/portofolio"
							onClick={() => setIsMobileMenuOpen(false)}
							className="text-base font-medium text-black/70 hover:text-black transition-colors font-poppins py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg px-2">
							Portofolio
						</Link>
						<Link
							href="/booking"
							onClick={() => setIsMobileMenuOpen(false)}
							className="text-base font-medium text-black/70 hover:text-black transition-colors font-poppins py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg px-2">
							Booking
						</Link>
						<Link
							href="/about"
							onClick={() => setIsMobileMenuOpen(false)}
							className="text-base font-medium text-black/70 hover:text-black transition-colors font-poppins py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg px-2">
							About
						</Link>
					</nav>

					{/* Divider */}
					<div className="h-[1px] bg-[#F1EEE6] w-full" />

					{/* Action Buttons */}
					<div className="flex flex-col gap-3 font-poppins">
						{!user ? (
							<>
								<Link
									href="/login"
									onClick={() => setIsMobileMenuOpen(false)}
									className="text-center text-sm font-semibold text-[#705D00] hover:bg-slate-50 transition-colors py-3 rounded-[20px] border border-[#F1EEE6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]">
									Sign In
								</Link>
								<Link
									href="/register"
									onClick={() => setIsMobileMenuOpen(false)}
									className="text-center text-sm font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all py-3 rounded-[20px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]">
									Register
								</Link>
							</>
						) : (
							<div className="flex flex-col gap-4">
								{/* User Info */}
								<div className="flex items-center gap-3 px-1">
									<div className="w-10 h-10 rounded-full bg-[#705D00] text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-md">
										{getInitial(user.full_name || user.name || user.email)}
									</div>
									<div className="truncate">
										<p className="text-sm font-bold text-[#1A1C1C] truncate">
											{user.full_name || user.name || 'User'}
										</p>
										<p className="text-xs text-[#4D4732] truncate">{user.email}</p>
									</div>
								</div>

								{/* Dashboard & Logout */}
								<Link
									href={
										user.role_id === 1
											? '/admin/dashboard'
											: user.role_id === 2
												? '/cashier'
												: '/my-bookings'
									}
									onClick={() => setIsMobileMenuOpen(false)}
									className="text-center text-sm font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all py-3 rounded-[20px] shadow-sm focus-visible:ring-2 focus-visible:ring-[#705D00]">
									{user.role_id === 1 || user.role_id === 2 ? 'Dashboard' : 'My Bookings'}
								</Link>
								<button
									onClick={() => {
										setIsMobileMenuOpen(false);
										logout();
									}}
									className="text-center text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors py-3 rounded-[20px] border border-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
									Sign Out
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
