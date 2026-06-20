'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavbarActions } from './NavbarActions';
import { cn } from '@/utils/cn';

export function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<header
			className={cn(
				'fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1440px] h-10 md:h-15 rounded-full z-50 flex items-center px-5 justify-between transition-all duration-500 ease-in-out',
				isScrolled
					? 'top-3 bg-white/60 backdrop-blur-lg border border-white/30 shadow-lg shadow-black/5'
					: 'top-5 bg-white border border-transparent shadow-md',
			)}>
			{/* Logo */}
			<div className="text-left ml-1 md:text-sm lg:ml-5 font-poppins text-black font-semibold text-base md:text-lg lg:text-xl">
				<Link href="/">
					<h1>terasfoto.studio</h1>
				</Link>
			</div>

			{/* Navigation Links (Desktop) */}
			<nav className="hidden md:flex md:text-sm lg:text-base items-center gap-4 md:gap-8 lg:gap-16">
				<Link
					href="/catalog"
					className="font-medium text-black/70 hover:text-black transition-colors font-poppins focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg  py-1">
					Catalog
				</Link>
				<Link
					href="/portofolio"
					className="font-medium text-black/70 hover:text-black transition-colors font-poppins focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg  py-1">
					Portofolio
				</Link>
				<Link
					href="/booking"
					className="font-medium text-black/70 hover:text-black transition-colors font-poppins focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg  py-1">
					Booking
				</Link>
				<Link
					href="/about"
					className="font-medium text-black/70 hover:text-black transition-colors font-poppins focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg  py-1">
					About
				</Link>
			</nav>

			{/* Client-side Actions (Auth, Mobile Menu) */}
			<NavbarActions />
		</header>
	);
}
