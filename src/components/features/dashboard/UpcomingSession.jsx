'use client';

import { Calendar, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import useSWR from 'swr';
import Link from 'next/link';
import { getMyBookingHistory } from '@/lib/services/bookingService';

const fetcher = () =>
	getMyBookingHistory().then(res => {
		if (res.success) return res.data;
		throw new Error(res.message || 'Gagal mengambil data');
	});

export function UpcomingSession() {
	const { data: bookings, error, isLoading } = useSWR('my-bookings-history', fetcher);

	// Find the nearest upcoming session
	const upcomingSession = bookings?.find(booking => {
		const bookingDate = new Date(booking.start_time);
		const now = new Date();
		return (
			bookingDate > now &&
			['pending_payment', 'confirmed', 'partial'].includes(booking.booking_status)
		);
	});

	if (isLoading) {
		return (
			<div className="relative w-full rounded-[20px] bg-[#FAF8F5] shadow-sm overflow-hidden flex flex-col md:flex-row animate-pulse">
				<div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
					<div className="w-32 h-8 bg-gray-200 rounded-full mb-6"></div>
					<div className="w-48 h-10 bg-gray-200 rounded-lg mb-2"></div>
					<div className="w-32 h-10 bg-gray-200 rounded-lg mb-6"></div>
					<div className="flex gap-4 mb-5">
						<div className="w-32 h-6 bg-gray-200 rounded"></div>
						<div className="w-32 h-6 bg-gray-200 rounded"></div>
					</div>
					<div className="w-24 h-6 bg-gray-200 rounded mb-5"></div>
					<div className="flex gap-4">
						<div className="w-32 h-12 bg-gray-200 rounded-[20px]"></div>
						<div className="w-40 h-12 bg-gray-200 rounded-[20px]"></div>
					</div>
				</div>
				<div className="relative h-[250px] md:h-auto md:w-[45%] md:min-w-[400px] bg-gray-200"></div>
			</div>
		);
	}

	if (error || !upcomingSession) {
		return (
			<div className="relative w-full rounded-[20px] bg-[#FAF8F5] shadow-sm overflow-hidden flex flex-col md:flex-row">
				<div className="p-8 md:p-10 flex-1 flex flex-col justify-center items-center text-center">
					<div className="w-16 h-16 bg-amber-50 text-[#705D00] rounded-full flex items-center justify-center mb-4">
						<Calendar className="w-8 h-8" />
					</div>
					<h2 className="font-poppins font-bold text-[24px] text-[#705E00] mb-2">
						Tidak Ada Sesi Mendatang
					</h2>
					<p className="font-poppins text-[#4D4732] mb-6">
						Anda belum memiliki jadwal foto yang akan datang.
					</p>
					<Link
						href="/booking"
						className="bg-[#705D00] hover:bg-[#5C4C00] transition-colors text-white font-poppins font-bold text-[16px] px-8 py-3 rounded-[20px]">
						Pesan Sekarang
					</Link>
				</div>
			</div>
		);
	}

	const startDate = new Date(upcomingSession.start_time);
	const endDate = new Date(upcomingSession.end_time);

	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(startDate);

	const formattedTime = `${startDate.toLocaleTimeString('id-ID', {
		hour: '2-digit',
		minute: '2-digit',
	})} - ${endDate.toLocaleTimeString('id-ID', {
		hour: '2-digit',
		minute: '2-digit',
	})}`;

	// Split service name into two lines if it's long
	const serviceNameParts = upcomingSession.service.service_name.split(' ');
	const firstLine = serviceNameParts.slice(0, Math.ceil(serviceNameParts.length / 2)).join(' ');
	const secondLine = serviceNameParts.slice(Math.ceil(serviceNameParts.length / 2)).join(' ');

	return (
		<div className="relative w-full rounded-[20px] bg-[#FAF8F5] shadow-sm overflow-hidden flex flex-col md:flex-row">
			{/* Left Content */}
			<div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative z-10">
				<div className="bg-[#705D00] inline-block px-4 py-1.5 rounded-full mb-6 w-max">
					<span className="font-poppins font-bold text-[12px] text-white tracking-[1.2px] uppercase">
						Upcoming Session
					</span>
				</div>

				<h2 className="font-poppins font-bold text-[28px] md:text-[36px] text-[#705E00] leading-tight mb-6">
					{firstLine}
					{secondLine && (
						<>
							<br />
							{secondLine}
						</>
					)}
				</h2>

				<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-5">
					<div className="flex items-center gap-3">
						<Calendar className="w-5 h-5 text-[#705D00]" />
						<span className="font-poppins font-semibold text-[16px] text-[#1A1C1C]">
							{formattedDate}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Clock className="w-5 h-5 text-[#705D00]" />
						<span className="font-poppins font-semibold text-[16px] text-[#1A1C1C]">
							{formattedTime}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-3 mb-5">
					<Users className="w-5 h-5 text-[#705D00]" />
					<span className="font-poppins font-semibold text-[16px] text-[#1A1C1C]">
						{upcomingSession.room.room_name}
					</span>
				</div>

				<div className="flex flex-wrap items-center gap-4">
					<Link
						href="/my-bookings"
						className="bg-[#705D00] hover:bg-[#5C4C00] transition-colors text-white font-poppins font-bold text-[16px] md:text-[18px] px-8 py-3 rounded-[20px] text-center">
						Reschedule
					</Link>
					<Link
						href="/my-bookings"
						className="bg-[#FFE766] hover:bg-[#F0D855] transition-colors text-[#705E00] font-poppins font-bold text-[16px] md:text-[18px] px-8 py-3 rounded-[20px] text-center">
						Session Details
					</Link>
				</div>
			</div>

			{/* Right Image (Background/Placeholder) */}
			<div className="relative h-[250px] md:h-auto md:w-[45%] md:min-w-[400px]">
				<div className="absolute inset-0 bg-[#E8E8E8]">
					{upcomingSession.service.thumbnail_url ? (
						<Image
							src={upcomingSession.service.thumbnail_url}
							alt={upcomingSession.service.service_name}
							fill
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-[#D0C6AB]/50 to-[#705D00]/20" />
					)}
				</div>
			</div>
		</div>
	);
}
