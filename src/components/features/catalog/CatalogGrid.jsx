'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CatalogGrid({ initialServices = [] }) {
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('default');
	const [durationFilter, setFilterDuration] = useState('all');

	// Helper to check if a service is popular
	const isPopularService = name => {
		const lowerName = name.toLowerCase();
		return (
			lowerName.includes('self') ||
			lowerName.includes('wedding') ||
			lowerName.includes('graduation')
		);
	};

	// Filter and sort logic
	const filteredAndSortedServices = useMemo(() => {
		let result = [...initialServices];

		// 1. Search filter (by name or description)
		if (searchQuery.trim() !== '') {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				service =>
					service.service_name.toLowerCase().includes(query) ||
					(service.description && service.description.toLowerCase().includes(query)),
			);
		}

		// 2. Duration filter
		if (durationFilter !== 'all') {
			result = result.filter(service => {
				const duration = service.duration_minutes;
				if (durationFilter === 'short') return duration <= 30;
				if (durationFilter === 'medium') return duration > 30 && duration <= 60;
				if (durationFilter === 'long') return duration > 60;
				return true;
			});
		}

		// 3. Sorting
		if (sortBy === 'price-asc') {
			result.sort((a, b) => parseInt(a.price) - parseInt(b.price));
		} else if (sortBy === 'price-desc') {
			result.sort((a, b) => parseInt(b.price) - parseInt(a.price));
		}

		return result;
	}, [initialServices, searchQuery, sortBy, durationFilter]);

	// Helper to generate slug for booking URL
	const getServiceSlug = name => {
		return name.toLowerCase().replace(/\s+/g, '-');
	};

	return (
		<div className="w-full min-h-screen bg-white flex justify-center">
			<div className="w-full ">
				{/* Full-width Hero Banner Container */}
				<div className="relative w-full h-screen overflow-hidden mb-12 shadow-md border border-[#D0C6AB]/20 bg-slate-50 group">
					<Image
						src="/images/e05009189de3c91ac84046d09f777dfd1e3a343c.jpg"
						alt="Teras Foto Studio Catalog Banner"
						fill
						sizes="100vw"
						className="object-cover"
						priority={true}
					/>
					{/* Warm overlay gradient */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

					{/* Subtle elegant watermark/text overlay at the bottom-left of the banner */}
					<div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-white z-10">
						<p className="font-poppins font-medium text-xs sm:text-sm tracking-widest uppercase opacity-90 mb-1">
							TERAS FOTO STUDIO
						</p>
						<p className="font-poppins font-bold text-lg sm:text-2xl tracking-tight">
							Professional Photography & Videography
						</p>
					</div>
				</div>

				{/* Section Header - Styled exactly like Figma */}
				<div className="px-1 md:px-13 ">
					<div className="mb-12 ">
						<span className="font-poppins font-bold text-sm tracking-[0.15em] text-[#705D00] uppercase block mb-3">
							OUR CATALOG
						</span>
						<h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-[48px] text-[#1A1C1C] leading-[1.2] mb-6 tracking-[-0.02em]">
							Capture your moments with
							<br className="hidden sm:inline" /> Warmth & Precision.
						</h1>
						<p className="font-poppins text-base sm:text-lg text-[#4D4732] leading-relaxed max-w-[720px]">
							Mulai dari potret diri pribadi hingga perayaan pernikahan megah, kami menyediakan
							layanan fotografi profesional yang disesuaikan dengan kisah unik Anda.
						</p>
					</div>

					{/* Search & Filter Controls */}
					<div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
						{/* Search Input */}
						<div className="relative flex-1 max-w-md">
							<label htmlFor="search-services" className="sr-only">
								Cari Layanan
							</label>
							<input
								id="search-services"
								type="text"
								placeholder="Cari paket foto..."
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								className="w-full h-12 pl-12 pr-4 bg-[#FEFEFF] border border-[#E5E2DC] rounded-full text-[#1C1B1B] placeholder-[#8E8777] font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-[#705D00] focus:border-transparent transition-all"
							/>
							<svg
								className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8777]"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>

						{/* Filters */}
						<div className="flex flex-wrap gap-3">
							{/* Duration Filter */}
							<div className="relative">
								<label htmlFor="duration-filter" className="sr-only">
									Filter Durasi
								</label>
								<select
									id="duration-filter"
									value={durationFilter}
									onChange={e => setFilterDuration(e.target.value)}
									className="h-12 px-6 bg-[#FEFEFF] border border-[#E5E2DC] rounded-full text-[#4E4633] font-poppins text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#705D00] transition-all appearance-none cursor-pointer pr-10">
									<option value="all">Semua Durasi</option>
									<option value="short">Singkat (≤ 30 mnt)</option>
									<option value="medium">Sedang (31 - 60 mnt)</option>
									<option value="long">Lama (&gt; 60 mnt)</option>
								</select>
								<svg
									className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4E4633] pointer-events-none"
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M2.5 4.5L6 8L9.5 4.5"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>

							{/* Sort Filter */}
							<div className="relative">
								<label htmlFor="sort-filter" className="sr-only">
									Urutkan Harga
								</label>
								<select
									id="sort-filter"
									value={sortBy}
									onChange={e => setSortBy(e.target.value)}
									className="h-12 px-6 bg-[#FEFEFF] border border-[#E5E2DC] rounded-full text-[#4E4633] font-poppins text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#705D00] transition-all appearance-none cursor-pointer pr-10">
									<option value="default">Urutkan</option>
									<option value="price-asc">Harga: Rendah ke Tinggi</option>
									<option value="price-desc">Harga: Tinggi ke Rendah</option>
								</select>
								<svg
									className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4E4633] pointer-events-none"
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M2.5 4.5L6 8L9.5 4.5"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* Results Count */}
					<div className="mb-8 text-sm font-poppins text-[#8E8777]">
						Menampilkan {filteredAndSortedServices.length} paket foto
					</div>

					{/* Grid Cards - 3 Columns exactly like Figma */}
					{filteredAndSortedServices.length > 0 ? (
						<div className="grid grid-cols-1 grid-cols-2 lg:grid-cols-3 gap-1 md:gap-8">
							{filteredAndSortedServices.map(service => (
								<div
									key={service.id}
									className="bg-white border border-[#D0C6AB]/20 rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(112,93,0,0.1)] transition-all duration-300 flex flex-col h-80 md:h-144 group">
									{/* Image Container - Height 337px exactly like Figma */}
									<div className="relative w-full h-[200] md:h-[337px] overflow-hidden bg-slate-50">
										{service.thumbnail_url ? (
											<Image
												src={service.thumbnail_url}
												alt={service.service_name}
												fill
												sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
												className="object-cover group-hover:scale-105 transition-transform duration-500"
												priority={true}
											/>
										) : (
											<div className="w-full h-full bg-[#F0EFF4] flex items-center justify-center">
												<svg
													className="text-[#8E8777]/40"
													width="48"
													height="48"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg">
													<path
														d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</div>
										)}
										{/* Popular Badge - Styled exactly like Figma */}
										{isPopularService(service.service_name) && (
											<div className="absolute  top-3 left-3 md:top-6 md:left-6 bg-[#705D00] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
												POPULAR
											</div>
										)}
									</div>

									{/* Content Container - Height 239px exactly like Figma */}
									<div className="p-2 md:p-6 flex-1 flex flex-col justify-between bg-white">
										<div className="space-y-3">
											<h2 className="font-poppins font-semibold text-sm md:text-2xl text-[#1A1C1C] leading-snug line-clamp-1 group-hover:text-[#705D00] transition-colors">
												{service.service_name}
											</h2>
											<p className="font-poppins text-[10px] sm:text-base text-[#4D4732] leading-relaxed line-clamp-2 ">
												{service.description || 'Tidak ada deskripsi untuk layanan ini.'}
											</p>
										</div>

										{/* Button - Styled exactly like Figma outline button */}
										<div className="mt-4">
											<Link
												href={`/catalog/${service.id}`}
												className="w-full h-8 md:h-12 border border-[#6C5E1B] text-[#6C5E1B] font-inter font-bold text-sm md:text-base rounded-full flex items-center justify-center hover:bg-[#6C5E1B] hover:text-white transition-all duration-300 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]"
												aria-label={`Lihat detail untuk ${service.service_name}`}>
												Lihat Detail
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						/* Empty State */
						<div className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-[#E5E2DC] rounded-[20px] bg-slate-50/50">
							<svg
								className="text-[#8E8777] mb-4"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<h3 className="font-poppins font-semibold text-lg text-[#1C1B1B] mb-1">
								Paket Tidak Ditemukan
							</h3>
							<p className="font-poppins text-sm text-[#4E4633] text-center max-w-xs">
								Coba cari dengan kata kunci lain atau ubah filter durasi yang Anda pilih.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
