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
				'fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1800px] h-15 md:h-md lg:h-20 rounded-full z-50 flex items-center px-5 justify-between transition-all duration-500 ease-in-out',
				isScrolled
					? 'top-3 bg-white/60 backdrop-blur-lg border border-white/30 shadow-lg shadow-black/5'
					: 'top-5 bg-white border border-transparent shadow-md',
			)}>
			{/* Logo */}
			<div className="text-left ml-1 lg:ml-5 ">
				<Link href="/">
					<Image
						src="/images/logo-navbar.png"
						alt="Teras Foto Studio Logo"
						width={80}
						height={40}
						className="object-contain w-[70px] h-[35px] md:w-[80px] md:h-[40px] lg:w-[100px] lg:h-[50px] transition-all duration-300"
					/>
				</Link>
			</div>

			{/* Navigation Links (Desktop) */}
			<nav className="hidden md:flex items-center gap-8 lg:gap-20">
				<Link
					href="/catalog"
					className="text-base font-medium text-black/70 hover:text-black transition-colors font-poppins focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg  py-1">
					Catalog
				</Link>
				<Link
					href="/portofolio"
					className="text-base font-medium text-black/70 hover:text-black transition-colors font-poppins focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg  py-1">
					Portofolio
				</Link>
				<Link
					href="/booking"
					className="text-base font-medium text-black/70 hover:text-black transition-colors font-poppins focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg  py-1">
					Booking
				</Link>
				<Link
					href="/about"
					className="text-base font-medium text-black/70 hover:text-black transition-colors font-poppins focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-lg  py-1">
					About
				</Link>
			</nav>

			{/* Client-side Actions (Auth, Mobile Menu) */}
			<NavbarActions />
		</header>
	);
}
