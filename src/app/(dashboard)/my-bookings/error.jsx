'use client';

import { useEffect } from 'react';

export default function MyBookingsError({ error, reset }) {
	useEffect(() => {
		console.error('Dashboard error:', error);
	}, [error]);

	return (
		<div className="w-full flex items-center justify-center py-12">
			<div className="w-full max-w-md px-4 text-center space-y-6">
				<div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-8 h-8">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
						/>
					</svg>
				</div>

				<div className="space-y-2">
					<h1 className="font-poppins font-bold text-2xl text-[#1C1B1B]">Terjadi Kesalahan</h1>
					<p className="font-poppins text-sm text-[#4E4633] leading-relaxed">
						{error?.message ||
							'Gagal memuat riwayat pesanan Anda. Silakan coba beberapa saat lagi.'}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						onClick={() => (window.location.href = '/')}
						className="font-poppins text-sm font-semibold border border-[#F1EEE6] text-[#4E4633] hover:bg-slate-50 transition-all px-6 py-3 rounded-[20px]">
						Kembali ke Beranda
					</button>
					<button
						onClick={() => reset()}
						className="font-poppins text-sm font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all px-6 py-3 rounded-[20px] shadow-sm">
						Coba Lagi
					</button>
				</div>
			</div>
		</div>
	);
}
