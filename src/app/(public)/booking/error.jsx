'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function BookingError({ error, reset }) {
	useEffect(() => {
		// Log the error to an error reporting service if needed
		console.error('Booking route error:', error);
	}, [error]);

	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#FCFAF6]">
			<div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-[30px] border border-[#F1EEE6] shadow-sm">
				{/* Error Icon */}
				<div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
					<svg
						className="w-8 h-8 text-red-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>

				{/* Error Message */}
				<div className="space-y-2">
					<h2 className="font-poppins font-bold text-2xl text-[#1A1C1C]">Terjadi Kesalahan</h2>
					<p className="font-poppins text-sm text-[#7E775F] leading-relaxed">
						Gagal memuat halaman pemesanan jadwal. Silakan periksa koneksi internet Anda atau coba
						beberapa saat lagi.
					</p>
					{error?.message && (
						<p className="font-mono text-xs text-red-500 bg-red-50 p-2 rounded-lg mt-2 break-all">
							{error.message}
						</p>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
					<Button
						type="button"
						onClick={() => reset()}
						className="w-full sm:w-auto bg-[#705D00] hover:bg-[#5c4d00] text-white font-semibold px-6 py-2.5 rounded-full transition-colors">
						Coba Lagi
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => (window.location.href = '/')}
						className="w-full sm:w-auto border-[#F1EEE6] hover:bg-slate-50 text-[#1A1C1C] font-semibold px-6 py-2.5 rounded-full transition-colors">
						Kembali ke Beranda
					</Button>
				</div>
			</div>
		</div>
	);
}
