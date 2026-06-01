'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { api } from '@/lib/api';
import BookingCard from '@/components/features/booking/BookingCard';
import RescheduleModal from '@/components/features/booking/RescheduleModal';

import { getMyBookingHistory } from '@/lib/services/bookingService';

// SWR Fetcher
const fetcher = () =>
	getMyBookingHistory().then(res => {
		if (res.success) return res.data;
		throw new Error(res.message || 'Gagal mengambil data');
	});

export default function MyBookingsClient({ initialBookings, initialError }) {
	const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState(null);

	// Fetch booking history using SWR for client-side updates/polling
	const {
		data: bookings,
		error: swrError,
		mutate,
	} = useSWR('my-bookings-history', fetcher, {
		fallbackData: initialBookings,
		revalidateOnMount: false, // We already have initial data from server
	});

	const error = swrError || initialError;

	if (error) {
		throw new Error(typeof error === 'string' ? error : error.message); // Will be caught by error.jsx
	}

	return (
		<div className="w-full">
			{/* Header Title */}
			<div className="mb-8">
				<h1 className="font-poppins font-bold text-[36px] text-[#705D00] leading-[46.8px] tracking-[-0.36px] mb-2">
					My Bookings
				</h1>
				<p className="font-inter text-[16px] text-[#7E775F] leading-[24px]">
					Manage your upcoming and past photography sessions.
				</p>
			</div>

			{/* Search and Filter */}
			<div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
				<div className="relative w-full sm:w-[450px]">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<svg
							width="18"
							height="18"
							viewBox="0 0 18 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
								fill="#7E775F"
							/>
						</svg>
					</div>
					<input
						type="text"
						placeholder="Search bookings..."
						className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl font-inter text-[15px] text-[#1A1C1C] placeholder-[#9CA3AF] focus:outline-none focus:border-[#705D00] focus:ring-1 focus:ring-[#705D00] transition-all shadow-sm"
					/>
				</div>
				<div className="relative w-full sm:w-[200px]">
					<select className="w-full pl-4 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-xl font-inter text-[15px] text-[#1A1C1C] appearance-none focus:outline-none focus:border-[#705D00] focus:ring-1 focus:ring-[#705D00] transition-all cursor-pointer shadow-sm">
						<option value="all">All Status</option>
						<option value="upcoming">Upcoming</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>
					<div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
						<svg
							width="12"
							height="8"
							viewBox="0 0 14 8"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M1 1L7 7L13 1"
								stroke="#7E775F"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>

			{/* Bookings List */}
			<div className="w-full">
				{bookings && bookings.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{bookings.map(booking => (
							<BookingCard
								key={booking.id}
								booking={booking}
								onActionSuccess={mutate}
								onRescheduleClick={setSelectedBookingForReschedule}
							/>
						))}
					</div>
				) : (
					/* Empty State */
					<div className="text-center py-16 px-4 bg-white rounded-[30px] border border-[#F1EEE6] shadow-sm space-y-6 max-w-2xl mx-auto">
						<div className="w-20 h-20 bg-amber-50 text-[#705D00] rounded-full flex items-center justify-center mx-auto">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-10 h-10">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
								/>
							</svg>
						</div>
						<div className="space-y-2">
							<h3 className="font-poppins font-bold text-xl text-[#1C1B1B]">Belum Ada Pesanan</h3>
							<p className="font-poppins text-sm text-[#4E4633] max-w-md mx-auto leading-relaxed">
								Kamu belum memiliki riwayat pemesanan jadwal foto. Yuk, abadikan momen terbaikmu
								bersama Teras Foto Studio sekarang!
							</p>
						</div>
						<div className="pt-2">
							<Link
								href="/booking"
								className="inline-block font-poppins text-sm font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all px-8 py-3.5 rounded-[20px] shadow-sm">
								Pesan Jadwal Foto
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Reschedule Modal */}
			{selectedBookingForReschedule && (
				<RescheduleModal
					booking={selectedBookingForReschedule}
					onClose={() => setSelectedBookingForReschedule(null)}
					onSuccess={mutate}
				/>
			)}
		</div>
	);
}
