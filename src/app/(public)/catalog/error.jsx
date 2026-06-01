'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function CatalogError({ error, reset }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Catalog error:', error);
	}, [error]);

	return (
		<div className="w-full min-h-[70vh] bg-white py-24 flex flex-col items-center justify-center px-4">
			<div className="text-center max-w-md">
				{/* Error Icon */}
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-6">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M12 9V14M12 17.01H12.01M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>

				<h2 className="font-poppins font-bold text-2xl text-[#1C1B1B] mb-3">
					Gagal Memuat Katalog
				</h2>
				<p className="font-poppins text-base text-[#4E4633] leading-relaxed mb-8">
					Maaf, kami mengalami kendala saat mengambil daftar layanan. Silakan coba beberapa saat
					lagi atau hubungi admin kami jika masalah berlanjut.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => reset()}
						className="inline-flex items-center justify-center px-6 h-12 bg-[#705D00] text-white font-inter font-bold text-base rounded-full hover:bg-[#5c4b00] transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] focus-visible:ring-offset-2">
						Coba Lagi
					</button>
					<Link
						href="/"
						className="inline-flex items-center justify-center px-6 h-12 border border-[#E5E2DC] text-[#4E4633] font-inter font-semibold text-base rounded-full hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] focus-visible:ring-offset-2">
						Kembali ke Beranda
					</Link>
				</div>
			</div>
		</div>
	);
}
