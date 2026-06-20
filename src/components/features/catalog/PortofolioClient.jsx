'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

const CATEGORIES = [
	'All Projects',
	'Wedding',
	'Self Photo',
	'Maternity',
	'Graduation',
	'Photobox',
	'Group',
];

const DEFAULT_PORTOFOLIO_ITEMS = [
	// All Projects
	{
		id: 1,
		category: 'All Projects',
		image: '/images/portofolio/all-projects/portofolio-1.png',
		alt: 'All Projects Photo 1',
	},
	{
		id: 2,
		category: 'All Projects',
		image: '/images/portofolio/all-projects/portofolio-2.png',
		alt: 'All Projects Photo 2',
	},
	{
		id: 3,
		category: 'All Projects',
		image: '/images/portofolio/all-projects/portofolio-3.png',
		alt: 'All Projects Photo 3',
	},
	{
		id: 4,
		category: 'All Projects',
		image: '/images/portofolio/all-projects/portofolio-4.png',
		alt: 'All Projects Photo 4',
	},
	{
		id: 5,
		category: 'All Projects',
		image: '/images/portofolio/all-projects/portofolio-5.png',
		alt: 'All Projects Photo 5',
	},
	{
		id: 6,
		category: 'All Projects',
		image: '/images/portofolio/all-projects/portofolio-6.png',
		alt: 'All Projects Photo 6',
	},

	// Wedding
	{
		id: 7,
		category: 'Wedding',
		image: '/images/portofolio/wedding/Rectangle 23.png',
		alt: 'Wedding Photo Session 1',
	},
	{
		id: 8,
		category: 'Wedding',
		image: '/images/portofolio/wedding/Rectangle 72.png',
		alt: 'Wedding Photo Session 2',
	},
	{
		id: 9,
		category: 'Wedding',
		image: '/images/portofolio/wedding/Rectangle 73.png',
		alt: 'Wedding Photo Session 3',
	},
	{
		id: 10,
		category: 'Wedding',
		image: '/images/portofolio/wedding/Rectangle 74.png',
		alt: 'Wedding Photo Session 4',
	},
	{
		id: 11,
		category: 'Wedding',
		image: '/images/portofolio/wedding/Rectangle 75.png',
		alt: 'Wedding Photo Session 5',
	},
	{
		id: 12,
		category: 'Wedding',
		image: '/images/portofolio/wedding/Rectangle 76.png',
		alt: 'Wedding Photo Session 6',
	},

	// Self Photo
	{
		id: 13,
		category: 'Self Photo',
		image: '/images/portofolio/self-photo/Rectangle 23.png',
		alt: 'Self Photo Session 1',
	},
	{
		id: 14,
		category: 'Self Photo',
		image: '/images/portofolio/self-photo/Rectangle 72.png',
		alt: 'Self Photo Session 2',
	},
	{
		id: 15,
		category: 'Self Photo',
		image: '/images/portofolio/self-photo/Rectangle 73.png',
		alt: 'Self Photo Session 3',
	},
	{
		id: 16,
		category: 'Self Photo',
		image: '/images/portofolio/self-photo/Rectangle 74.png',
		alt: 'Self Photo Session 4',
	},
	{
		id: 17,
		category: 'Self Photo',
		image: '/images/portofolio/self-photo/Rectangle 75.png',
		alt: 'Self Photo Session 5',
	},
	{
		id: 18,
		category: 'Self Photo',
		image: '/images/portofolio/self-photo/Rectangle 76.png',
		alt: 'Self Photo Session 6',
	},

	// Maternity
	{
		id: 19,
		category: 'Maternity',
		image: '/images/portofolio/maternity/Rectangle 23.png',
		alt: 'Maternity Photo Session 1',
	},
	{
		id: 20,
		category: 'Maternity',
		image: '/images/portofolio/maternity/Rectangle 72.png',
		alt: 'Maternity Photo Session 2',
	},
	{
		id: 21,
		category: 'Maternity',
		image: '/images/portofolio/maternity/Rectangle 73.png',
		alt: 'Maternity Photo Session 3',
	},
	{
		id: 22,
		category: 'Maternity',
		image: '/images/portofolio/maternity/Rectangle 74.png',
		alt: 'Maternity Photo Session 4',
	},
	{
		id: 23,
		category: 'Maternity',
		image: '/images/portofolio/maternity/Rectangle 75.png',
		alt: 'Maternity Photo Session 5',
	},
	{
		id: 24,
		category: 'Maternity',
		image: '/images/portofolio/maternity/Rectangle 76.png',
		alt: 'Maternity Photo Session 6',
	},

	// Graduation
	{
		id: 25,
		category: 'Graduation',
		image: '/images/portofolio/graduation/Rectangle 23.png',
		alt: 'Graduation Photo Session 1',
	},
	{
		id: 26,
		category: 'Graduation',
		image: '/images/portofolio/graduation/Rectangle 72.png',
		alt: 'Graduation Photo Session 2',
	},
	{
		id: 27,
		category: 'Graduation',
		image: '/images/portofolio/graduation/Rectangle 73.png',
		alt: 'Graduation Photo Session 3',
	},
	{
		id: 28,
		category: 'Graduation',
		image: '/images/portofolio/graduation/Rectangle 74.png',
		alt: 'Graduation Photo Session 4',
	},
	{
		id: 29,
		category: 'Graduation',
		image: '/images/portofolio/graduation/Rectangle 75.png',
		alt: 'Graduation Photo Session 5',
	},
	{
		id: 30,
		category: 'Graduation',
		image: '/images/portofolio/graduation/Rectangle 76.png',
		alt: 'Graduation Photo Session 6',
	},

	// Photobox
	{
		id: 31,
		category: 'Photobox',
		image: '/images/portofolio/photobox/Rectangle 23.png',
		alt: 'Photobox Session 1',
	},
	{
		id: 32,
		category: 'Photobox',
		image: '/images/portofolio/photobox/Rectangle 72.png',
		alt: 'Photobox Session 2',
	},
	{
		id: 33,
		category: 'Photobox',
		image: '/images/portofolio/photobox/Rectangle 73.png',
		alt: 'Photobox Session 3',
	},
	{
		id: 34,
		category: 'Photobox',
		image: '/images/portofolio/photobox/Rectangle 74.png',
		alt: 'Photobox Session 4',
	},
	{
		id: 35,
		category: 'Photobox',
		image: '/images/portofolio/photobox/Rectangle 75.png',
		alt: 'Photobox Session 5',
	},
	{
		id: 36,
		category: 'Photobox',
		image: '/images/portofolio/photobox/Rectangle 76.png',
		alt: 'Photobox Session 6',
	},

	// Group
	{
		id: 37,
		category: 'Group',
		image: '/images/portofolio/group/Rectangle 23.png',
		alt: 'Group Photo Session 1',
	},
	{
		id: 38,
		category: 'Group',
		image: '/images/portofolio/group/Rectangle 72.png',
		alt: 'Group Photo Session 2',
	},
	{
		id: 39,
		category: 'Group',
		image: '/images/portofolio/group/Rectangle 73.png',
		alt: 'Group Photo Session 3',
	},
	{
		id: 40,
		category: 'Group',
		image: '/images/portofolio/group/Rectangle 74.png',
		alt: 'Group Photo Session 4',
	},
	{
		id: 41,
		category: 'Group',
		image: '/images/portofolio/group/Rectangle 75.png',
		alt: 'Group Photo Session 5',
	},
	{
		id: 42,
		category: 'Group',
		image: '/images/portofolio/group/Rectangle 76.png',
		alt: 'Group Photo Session 6',
	},
];

export default function PortofolioClient({ initialItems }) {
	const [activeCategory, setActiveCategory] = useState('All Projects');

	const items = initialItems || DEFAULT_PORTOFOLIO_ITEMS;
	const filteredItems = items.filter(item => item.category === activeCategory);

	return (
		<main className="w-full min-h-screen bg-white pt-32 pb-24 flex flex-col items-center">
			<div className="w-full max-w-[1440px] px-4 sm:px-8 md:px-16 lg:px-[118px] flex flex-col items-center">
				{/* Header Section */}
				<div className="text-center max-w-[800px] mb-12">
					<h1 className="font-poppins font-bold text-3xl sm:text-4xl md:text-[48px] text-[#1A1C1C] leading-[1.2] mb-4">
						Our Creative Journey
					</h1>
					<p className="font-inter text-base sm:text-lg text-[#4D4732] leading-[1.6] max-w-[627px] mx-auto">
						Capturing the warmth of your most precious moments through the lens of timeless
						aesthetics.
					</p>
				</div>

				{/* Filter Categories (Pills) */}
				<div className="w-full overflow-x-auto no-scrollbar flex justify-start md:justify-center gap-3 mb-16 pb-2">
					<div className="flex gap-3 px-2">
						{CATEGORIES.map(category => {
							const isActive = activeCategory === category;
							return (
								<button
									key={category}
									onClick={() => setActiveCategory(category)}
									className={cn(
										'px-6 py-2 rounded-full font-inter font-semibold text-base transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]',
										isActive
											? 'bg-[#705D00] text-white shadow-sm'
											: 'bg-[#F3E08F] text-[#70621F] hover:bg-[#ebd273]',
									)}>
									{category}
								</button>
							);
						})}
					</div>
				</div>

				{/* Grid Galeri Foto */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
					{filteredItems.map(item => (
						<div
							key={item.id}
							className="relative aspect-[394/381] w-full overflow-hidden rounded-[40px] shadow-md group bg-slate-100">
							<Image
								src={item.image}
								alt={item.alt}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								priority={item.id <= 3}
							/>
							{/* Overlay on Hover */}
							<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
								<span className="text-white font-poppins font-semibold text-lg bg-[#705D00]/90 px-4 py-2 rounded-full shadow-md">
									{item.category}
								</span>
							</div>
						</div>
					))}
				</div>

				{filteredItems.length === 0 && (
					<div className="text-center py-20">
						<p className="text-lg text-[#4D4732] font-poppins">
							No projects found in this category.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
