'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
	Check,
	Download,
	MessageCircle,
	Clock,
	Image as ImageIcon,
	Calendar,
	MapPin,
	Users,
} from 'lucide-react';
import useSWR from 'swr';
import { api } from '@/lib/api';

// Komponen utama yang dibungkus Suspense
export default function BookingSuccessPage() {
	return (
		<Suspense fallback={<LoadingState />}>
			<BookingSuccessContent />
		</Suspense>
	);
}

function LoadingState() {
	return (
		<div className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 flex items-center justify-center">
			<div className="animate-pulse flex flex-col items-center">
				<div className="w-16 h-16 border-4 border-[#705D00] border-t-transparent rounded-full animate-spin mb-4"></div>
				<p className="font-poppins text-[#705D00] font-medium">Memuat data pesanan...</p>
			</div>
		</div>
	);
}

function BookingSuccessContent() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get('order_id');

	// Fetch data booking berdasarkan order_id
	// Jika tidak ada order_id, kita bisa fetch booking terakhir user, tapi untuk sekarang kita asumsikan ada order_id
	const { data: bookingData, isLoading } = useSWR(
		orderId ? `/booking/${orderId}` : null,
		async url => {
			try {
				const res = await api.get(url);
				return res.data;
			} catch (error) {
				console.error('Error fetching booking:', error);
				return null;
			}
		},
	);

	// Dummy data fallback jika API belum siap atau tidak ada order_id
	const data = bookingData || {
		booking_code: orderId || 'TF-2024-8842',
		service: { service_name: 'Self Photo Studio' },
		start_time: new Date().toISOString(),
		room: { room_name: 'Teras Foto Studio' },
		booking_status: 'confirmed',
	};

	const formattedDate = new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(data.start_time));

	const formattedTime = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}).format(new Date(data.start_time));

	return (
		<div className="min-h-screen bg-[#FAF8F5] pt-32 pb-20 px-4 md:px-8 lg:px-16">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-12">
					<p className="font-poppins text-[16px] text-[#705D00] tracking-[0.1em] uppercase mb-4">
						BOOKING &gt; PEMBAYARAN
					</p>
					<h1 className="font-poppins font-bold text-[36px] md:text-[48px] text-[#705D00] leading-[1.2] tracking-[-0.02em] mb-4">
						Lihat Status Pesanan
					</h1>
					<p className="font-poppins text-[16px] md:text-[18px] text-[#4D4732] leading-[1.6] max-w-2xl">
						Lihat progres sesi foto kamu di sini, dari jepretan pertama sampai siap diunduh.
					</p>
				</div>

				{/* Progress Tracker */}
				<div className="bg-white rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] p-8 mb-8 overflow-x-auto">
					<div className="min-w-[800px] relative flex justify-between items-start px-8">
						{/* Connecting Lines */}
						<div className="absolute top-6 left-[10%] right-[10%] h-[5px] bg-[#E2E2E2] z-0"></div>
						<div className="absolute top-6 left-[10%] w-[60%] h-[5px] bg-[#705D00] z-0"></div>

						{/* Step 1 */}
						<div className="relative z-10 flex flex-col items-center w-1/4">
							<div className="w-12 h-12 rounded-full bg-[#705D00] flex items-center justify-center mb-4">
								<Check className="w-6 h-6 text-white" />
							</div>
							<p className="font-poppins font-bold text-[14px] md:text-[16px] text-[#1A1C1C] text-center leading-[1.6]">
								Booking
								<br />
								Berhasil
							</p>
						</div>

						{/* Step 2 */}
						<div className="relative z-10 flex flex-col items-center w-1/4">
							<div className="w-12 h-12 rounded-full bg-[#705D00] flex items-center justify-center mb-4">
								<Check className="w-6 h-6 text-white" />
							</div>
							<p className="font-poppins font-bold text-[14px] md:text-[16px] text-[#1A1C1C] text-center leading-[1.6]">
								Pembayaran
								<br />
								Dikonfirmasi
							</p>
						</div>

						{/* Step 3 */}
						<div className="relative z-10 flex flex-col items-center w-1/4">
							<div className="w-12 h-12 rounded-full bg-[#705D00] flex items-center justify-center mb-4">
								<Check className="w-6 h-6 text-white" />
							</div>
							<p className="font-poppins font-bold text-[14px] md:text-[16px] text-[#1A1C1C] text-center leading-[1.6]">
								Sesi Foto
								<br />
								Dijadwalkan
							</p>
						</div>

						{/* Step 4 (Active) */}
						<div className="relative z-10 flex flex-col items-center w-1/4">
							<div className="w-12 h-12 rounded-full bg-[#FFD700] border-[5px] border-[#F3E08F] flex items-center justify-center mb-4">
								<div className="w-3 h-3 bg-[#705D00] rounded-full"></div>
							</div>
							<p className="font-poppins font-bold text-[14px] md:text-[16px] text-[#1A1C1C] text-center leading-[1.6]">
								Lihat Hasil
								<br />
								Foto
							</p>
						</div>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* Left Column - Order Details */}
					<div className="lg:col-span-5 space-y-8">
						<div className="bg-[#F3F3F4] rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] p-8">
							<div className="flex justify-between items-start mb-8">
								<h2 className="font-poppins font-semibold text-[24px] text-[#705D00]">
									Detail Pesanan
								</h2>
								<div className="text-right">
									<p className="font-poppins font-semibold text-[12px] text-[#4D4732] tracking-[0.1em] uppercase mb-1">
										BOOKING ID
									</p>
									<p className="font-poppins font-semibold text-[20px] md:text-[24px] text-[#1A1C1C]">
										{data.booking_code}
									</p>
								</div>
							</div>

							<div className="space-y-6">
								<div className="flex justify-between items-center border-b border-[#E2E2E2] pb-4">
									<div className="flex items-center gap-3 text-[#4D4732]">
										<ImageIcon className="w-5 h-5" />
										<span className="font-poppins text-[16px]">Paket Foto</span>
									</div>
									<span className="font-poppins font-semibold text-[16px] text-[#1A1C1C]">
										{data.service.service_name}
									</span>
								</div>

								<div className="flex justify-between items-center border-b border-[#E2E2E2] pb-4">
									<div className="flex items-center gap-3 text-[#4D4732]">
										<Calendar className="w-5 h-5" />
										<span className="font-poppins text-[16px]">Jadwal Foto</span>
									</div>
									<span className="font-poppins font-semibold text-[16px] text-[#1A1C1C]">
										{formattedDate}
									</span>
								</div>

								<div className="flex justify-between items-center border-b border-[#E2E2E2] pb-4">
									<div className="flex items-center gap-3 text-[#4D4732]">
										<MapPin className="w-5 h-5" />
										<span className="font-poppins text-[16px]">Lokasi</span>
									</div>
									<span className="font-poppins font-semibold text-[16px] text-[#1A1C1C]">
										{data.room?.room_name || 'Teras Foto Studio'}
									</span>
								</div>

								<div className="flex justify-between items-center pb-4">
									<div className="flex items-center gap-3 text-[#4D4732]">
										<Users className="w-5 h-5" />
										<span className="font-poppins text-[16px]">Jumlah</span>
									</div>
									<span className="font-poppins font-semibold text-[16px] text-[#1A1C1C]">
										2 Orang
									</span>
								</div>
							</div>

							<button className="w-full mt-6 bg-[#705D01] hover:bg-[#5C4C00] transition-colors text-white font-poppins font-bold text-[18px] md:text-[20px] py-4 rounded-[20px] flex items-center justify-center gap-3">
								<Download className="w-6 h-6" />
								Download Invoice
							</button>
						</div>
					</div>

					{/* Right Column - Process Status & Support */}
					<div className="lg:col-span-7 space-y-8">
						{/* Process Status */}
						<div className="bg-[#E2E2E2] rounded-[20px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] p-8 relative overflow-hidden">
							<div className="bg-[#705E00] inline-block px-4 py-1.5 rounded-full mb-6">
								<span className="font-poppins font-semibold text-[10px] text-white tracking-[0.1em] uppercase">
									STATUS PROSES
								</span>
							</div>

							<h3 className="font-poppins font-semibold text-[24px] text-[#1A1C1C] mb-4">
								Proses Editing Sedang Berlangsung.
							</h3>

							<p className="font-poppins text-[16px] text-[#4D4732] leading-[1.6] mb-8">
								Foto-foto sesi Anda dari "{data.service.service_name}" saat ini sedang dalam tahap
								pengeditan warna. Kami memastikan setiap foto sesuai dengan kehangatan khas Golden
								Hour kami.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8">
								<div className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-[#1A1C1C]" />
									<span className="font-poppins text-[16px] text-[#1A1C1C]">
										Estimasi Selesai : 2 Hari
									</span>
								</div>
								<div className="flex items-center gap-3">
									<ImageIcon className="w-5 h-5 text-[#1A1C1C]" />
									<span className="font-poppins text-[16px] text-[#1A1C1C]">
										Total Foto: 45 File
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2 text-[#4D4732]">
								<Clock className="w-4 h-4" />
								<span className="font-poppins text-[14px]">
									{formattedDate} • {formattedTime}
								</span>
							</div>
						</div>

						{/* Contact Support */}
						<div className="bg-[#F3F3F4] rounded-[20px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
							<div>
								<h4 className="font-poppins font-semibold text-[20px] md:text-[24px] text-[#1A1C1C] mb-2">
									Ada kendala dengan proses booking ?
								</h4>
								<p className="font-poppins text-[14px] md:text-[16px] text-[#4D4732] leading-[1.5]">
									Asisten studio kami tersedia 24/7 untuk menjawab pertanyaan apa pun tentang sesi
									atau status galeri Anda.
								</p>
							</div>
							<Link
								href="https://wa.me/6281234567890"
								target="_blank"
								className="shrink-0 bg-[#705D01] hover:bg-[#5C4C00] transition-colors text-white font-poppins font-semibold text-[16px] px-6 py-3 rounded-[20px] flex items-center gap-2">
								<MessageCircle className="w-5 h-5" />
								Contact Support
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
