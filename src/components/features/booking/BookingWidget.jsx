'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import {
	format,
	startOfMonth,
	endOfMonth,
	addDays,
	isSameDay,
	parseISO,
	isBefore,
	startOfDay,
	eachDayOfInterval,
	getDay,
	addMonths,
	subMonths,
	isSameMonth,
} from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

// SWR fetcher wrapper
const fetcher = url => api.get(url);

export default function BookingWidget() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialServiceSlug = searchParams.get('service');

	// States
	const [selectedService, setSelectedService] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
	const [selectedTime, setSelectedTime] = useState('');
	const [paymentType, setPaymentType] = useState('dp'); // 'dp' or 'full'
	const [occupiedSlots, setOccupiedSlots] = useState([]);
	const [bookingLoading, setBookingLoading] = useState(false);
	const [bookingError, setBookingLoadingError] = useState('');

	// Fetch Services
	const {
		data: servicesResponse,
		error: servicesError,
		isLoading: servicesLoading,
	} = useSWR('/services', fetcher);

	const services = servicesResponse?.data || [];

	// Set initial service if slug is present in URL
	useEffect(() => {
		if (services.length > 0 && initialServiceSlug) {
			const matched = services.find(
				s => s.service_name.toLowerCase().replace(/\s+/g, '-') === initialServiceSlug.toLowerCase(),
			);
			if (matched) {
				// Defer state update to avoid synchronous cascading render warning
				const timer = setTimeout(() => {
					setSelectedService(matched);
				}, 0);
				return () => clearTimeout(timer);
			}
		}
	}, [services, initialServiceSlug]);

	// Fetch Occupied Slots when selectedService or currentMonth changes
	useEffect(() => {
		if (!selectedService) return;

		const fetchAvailability = async () => {
			try {
				// Fetch for the current month being viewed
				const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
				const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
				const roomId = selectedService.room_id;

				const response = await api.get(
					`/bookings/availability?start_date=${start}&end_date=${end}&room_id=${roomId}`,
				);
				setOccupiedSlots(response.data || []);
			} catch (err) {
				console.error('Failed to fetch availability:', err);
			}
		};

		fetchAvailability();
	}, [selectedService, currentMonth]);

	// Generate Time Slots dynamically based on selected service duration
	const timeSlots = useMemo(() => {
		if (!selectedService) return [];

		const slots = [];
		const startMinutes = 9 * 60; // 09:00
		const endMinutes = 21 * 60; // 21:00
		const duration = selectedService.duration_minutes || 60;

		for (let minutes = startMinutes; minutes + duration <= endMinutes; minutes += duration) {
			const hour = Math.floor(minutes / 60);
			const mins = minutes % 60;
			const formattedHour = hour.toString().padStart(2, '0');
			const formattedMins = mins.toString().padStart(2, '0');
			slots.push(`${formattedHour}:${formattedMins}`);
		}
		return slots;
	}, [selectedService]);

	// Check if a slot is disabled (overlap logic)
	const isSlotDisabled = time => {
		if (!selectedService) return true;

		// 1. Check if the slot is in the past
		const [hours, minutes] = time.split(':').map(Number);
		const slotStart = new Date(selectedDate);
		slotStart.setHours(hours, minutes, 0, 0);

		if (isBefore(slotStart, new Date())) {
			return true;
		}

		// 2. Check overlap with occupied slots
		const durationMinutes = selectedService.duration_minutes || 60;
		const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

		return occupiedSlots.some(occupied => {
			const occupiedStart = parseISO(occupied.start_time);
			const occupiedEnd = parseISO(occupied.end_time);

			// Overlap condition: slotStart < occupiedEnd && slotEnd > occupiedStart
			return slotStart < occupiedEnd && slotEnd > occupiedStart;
		});
	};

	// Handle Booking Submission
	const handleBooking = async () => {
		if (!isAuthenticated) {
			alert('Silakan login terlebih dahulu untuk melakukan pemesanan.');
			router.push(`/login?redirect=/booking`);
			return;
		}

		if (!selectedService || !selectedDate || !selectedTime) {
			alert('Silakan pilih layanan, tanggal, dan waktu terlebih dahulu.');
			return;
		}

		setBookingLoading(true);
		setBookingLoadingError('');

		try {
			// Combine date and time into ISO string safely
			const dateString = format(selectedDate, 'yyyy-MM-dd');
			const startTimeISO = new Date(`${dateString}T${selectedTime}:00`).toISOString();

			const response = await api.post('/bookings', {
				service_id: selectedService.id,
				start_time: startTimeISO,
				payment_type: paymentType,
			});

			if (response.success && response.data?.payment_url) {
				// Redirect to Midtrans payment page
				window.location.href = response.data.payment_url;
			} else {
				throw new Error(response.message || 'Gagal membuat booking');
			}
		} catch (err) {
			console.error('Booking error:', err);
			setBookingLoadingError(
				err.message || 'Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.',
			);
		} finally {
			setBookingLoading(false);
		}
	};

	// Calendar Generation
	const daysInMonth = eachDayOfInterval({
		start: startOfMonth(currentMonth),
		end: endOfMonth(currentMonth),
	});

	const startingDayIndex = getDay(startOfMonth(currentMonth)); // 0 = Sunday, 1 = Monday, etc.

	const handlePrevMonth = () => {
		setCurrentMonth(subMonths(currentMonth, 1));
	};

	const handleNextMonth = () => {
		setCurrentMonth(addMonths(currentMonth, 1));
	};

	if (servicesLoading) {
		return (
			<div className="w-full bg-white rounded-[30px] border border-[#F1EEE6] shadow-sm overflow-hidden p-8 animate-pulse">
				<div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[1, 2, 3].map(i => (
						<div key={i} className="h-64 bg-gray-200 rounded-[20px]"></div>
					))}
				</div>
			</div>
		);
	}

	if (servicesError) {
		return (
			<div className="text-center py-12">
				<p className="font-poppins text-red-600">Gagal memuat layanan. Silakan coba lagi nanti.</p>
			</div>
		);
	}

	// TAHAP 1: Pilih Layanan (Jika belum ada yang dipilih)
	if (!selectedService) {
		return (
			<div className="w-full">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{services.map(service => (
						<div
							key={service.id}
							onClick={() => {
								setSelectedService(service);
								setSelectedTime('');
								setPaymentType('dp');
							}}
							className="bg-white rounded-[20px] border border-[#F1EEE6] overflow-hidden cursor-pointer hover:shadow-lg transition-all group flex flex-col">
							<div className="relative h-48 w-full bg-[#F3F3F4]">
								{service.thumbnail_url ? (
									<Image
										src={service.thumbnail_url}
										alt={service.service_name}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-[#8E8777]/40">
										<svg
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
							</div>
							<div className="p-6 flex flex-col flex-grow">
								<h3 className="font-poppins font-semibold text-xl text-[#1A1C1C] mb-2">
									{service.service_name}
								</h3>
								<p className="font-poppins text-sm text-[#7E775F] mb-4 line-clamp-2 flex-grow">
									{service.description ||
										'Nikmati sesi foto berkualitas tinggi dengan peralatan profesional.'}
								</p>
								<div className="flex justify-between items-center pt-4 border-t border-[#F1EEE6]">
									<span className="font-poppins font-bold text-lg text-[#705D00]">
										Rp {parseInt(service.price).toLocaleString('id-ID')}
									</span>
									<span className="font-poppins text-xs font-medium text-[#7E775F] bg-[#F1EEE6] px-3 py-1.5 rounded-full">
										{service.duration_minutes} Menit
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// TAHAP 2: Pilih Tanggal, Waktu & Summary
	return (
		<div className="w-full bg-white rounded-[40px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-12">
				{/* Sisi Kiri: Kalender & Waktu (7 Cols) */}
				<div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#F1EEE6]">
					<div className="mb-10">
						<h2 className="font-poppins font-semibold text-2xl text-[#1A1C1C] mb-8">Session</h2>

						{/* Calendar Header */}
						<div className="flex items-center justify-between mb-6">
							<h3 className="font-poppins font-semibold text-[32px] text-[#705D00]">
								{format(currentMonth, 'MMMM yyyy', { locale: localeID })}
							</h3>
							<div className="flex gap-2">
								<button
									onClick={handlePrevMonth}
									className="w-10 h-10 rounded-full flex items-center justify-center text-[#705D00] hover:bg-[#F1EEE6] transition-colors">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M15 18L9 12L15 6"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
								<button
									onClick={handleNextMonth}
									className="w-10 h-10 rounded-full flex items-center justify-center text-[#705D00] hover:bg-[#F1EEE6] transition-colors">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M9 18L15 12L9 6"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Calendar Grid */}
						<div className="grid grid-cols-7 gap-y-4 mb-4">
							{/* Day Names */}
							{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
								<div
									key={day}
									className="text-center font-poppins font-semibold text-base text-[#4D4732] tracking-[0.075em]">
									{day}
								</div>
							))}

							{/* Empty cells for days before start of month */}
							{Array.from({ length: startingDayIndex }).map((_, index) => (
								<div key={`empty-${index}`} className="h-12"></div>
							))}

							{/* Days */}
							{daysInMonth.map(day => {
								const isSelected = isSameDay(selectedDate, day);
								const isPast = isBefore(startOfDay(day), startOfDay(new Date()));

								return (
									<div key={day.toString()} className="flex justify-center">
										<button
											onClick={() => {
												if (!isPast) {
													setSelectedDate(day);
													setSelectedTime('');
												}
											}}
											disabled={isPast}
											className={`w-12 h-12 rounded-full flex items-center justify-center font-poppins font-semibold text-xl transition-all ${
												isSelected
													? 'bg-[#705D00] text-white'
													: isPast
														? 'text-[#D8D6CF] cursor-not-allowed'
														: 'text-[#4D4732] hover:bg-[#F1EEE6]'
											}`}>
											{format(day, 'd')}
										</button>
									</div>
								);
							})}
						</div>

						{/* Legend */}
						<div className="flex items-center gap-6 mt-6 border-t border-[#000000]/50 pt-6">
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 rounded-full bg-[#F3E08F]"></div>
								<span className="font-poppins font-semibold text-base text-[#4D4732]">
									Available
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 rounded-full bg-[#F3F3F4]"></div>
								<span className="font-poppins font-semibold text-base text-[#4D4732]">
									Full Booked
								</span>
							</div>
						</div>
					</div>

					{/* Time Slots */}
					<div>
						<h3 className="font-poppins font-semibold text-2xl text-[#1A1C1C] mb-6">
							Pilih jam yang tersedia
						</h3>
						<div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
							{timeSlots.map(time => {
								const disabled = isSlotDisabled(time);
								const isSelected = selectedTime === time;

								return (
									<button
										key={time}
										type="button"
										disabled={disabled}
										onClick={() => setSelectedTime(time)}
										className={`h-[50px] rounded-[20px] font-poppins font-semibold text-base transition-all flex items-center justify-center ${
											disabled
												? 'bg-[#B0ACA0] text-white/50 cursor-not-allowed'
												: isSelected
													? 'bg-[#705E00] text-white'
													: 'bg-[#F3F3F4] text-[#4D4732] hover:bg-[#E2E2E2]'
										}`}>
										{time}
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Sisi Kanan: Summary Card (5 Cols) */}
				<div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 bg-[#F3F3F4]">
					<div className="bg-white rounded-[20px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] overflow-hidden flex flex-col h-full">
						{/* Image */}
						<div className="relative h-[256px] w-full bg-[#E2E2E2]">
							{selectedService.thumbnail_url ? (
								<Image
									src={selectedService.thumbnail_url}
									alt={selectedService.service_name}
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-[#8E8777]/40">
									<svg
										width="64"
										height="64"
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
						</div>

						<div className="p-6 flex flex-col flex-grow">
							{/* Service Info */}
							<div className="mb-6">
								<div className="flex justify-between items-start mb-2">
									<h3 className="font-poppins font-semibold text-2xl text-[#1A1C1C]">
										{selectedService.service_name}
									</h3>
									<button
										onClick={() => setSelectedService(null)}
										className="text-xs font-poppins font-semibold text-[#705D00] uppercase tracking-widest hover:underline">
										Ganti
									</button>
								</div>

								<div className="space-y-2 mt-4">
									<div className="flex items-center gap-3">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 7H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
												stroke="#705D00"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span className="font-poppins font-semibold text-base text-[#1A1C1C]">
											{format(selectedDate, 'EEEE, MMM d, yyyy', { locale: localeID })}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
												stroke="#705D00"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span className="font-poppins text-sm text-[#4D4732]">
											{selectedTime
												? `${selectedTime} - ${format(new Date(new Date().setHours(...selectedTime.split(':'))).getTime() + selectedService.duration_minutes * 60000, 'HH:mm')}`
												: 'Pilih waktu sesi'}
										</span>
									</div>
									<div className="flex items-start gap-3">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											className="mt-0.5">
											<path
												d="M17.6569 16.6569C16.7202 17.5935 14.7681 19.5457 12.7324 21.5815C12.3506 21.9633 11.6494 21.9633 11.2676 21.5815C9.23192 19.5457 7.27984 17.5935 6.34315 16.6569C3.21895 13.5327 3.21895 8.46734 6.34315 5.34315C9.46734 2.21895 14.5327 2.21895 17.6569 5.34315C20.781 8.46734 20.781 13.5327 17.6569 16.6569Z"
												stroke="#705D00"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z"
												stroke="#705D00"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span className="font-poppins text-sm text-[#4D4732]">
											Jl.Serang, Cikande, Kec. Cikande, Kabupaten Serang
										</span>
									</div>
								</div>
							</div>

							{/* Payment Options */}
							<div className="mb-6">
								<h4 className="font-poppins font-semibold text-lg text-[#1A1C1C] mb-3">
									Pilihan paket
								</h4>
								<div className="space-y-3">
									{/* DP Option */}
									<div
										onClick={() => setPaymentType('dp')}
										className={`p-4 rounded-[20px] border-2 cursor-pointer transition-all flex items-center justify-between ${
											paymentType === 'dp'
												? 'border-[#705D00] bg-white'
												: 'border-[#F1EEE6] bg-[#F3F3F4]'
										}`}>
										<div className="flex items-center gap-3">
											<div
												className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
													paymentType === 'dp' ? 'border-[#705D00]' : 'border-[#B0ACA0]'
												}`}>
												{paymentType === 'dp' && (
													<div className="w-2.5 h-2.5 rounded-full bg-[#705D00]"></div>
												)}
											</div>
											<div>
												<p className="font-poppins font-semibold text-sm text-[#1A1C1C]">
													Bayar Sesuai Kepuasan Kamu
												</p>
												<p className="font-poppins text-xs text-[#4D4732]">
													Pastikan jadwal kamu tersedia
												</p>
											</div>
										</div>
										<span className="font-poppins font-semibold text-lg text-[#705D00]">
											Rp {(parseInt(selectedService.price) / 2).toLocaleString('id-ID')}
										</span>
									</div>

									{/* Full Option */}
									<div
										onClick={() => setPaymentType('full')}
										className={`p-4 rounded-[20px] border-2 cursor-pointer transition-all flex items-center justify-between ${
											paymentType === 'full'
												? 'border-[#705D00] bg-white'
												: 'border-[#F1EEE6] bg-[#F3F3F4]'
										}`}>
										<div className="flex items-center gap-3">
											<div
												className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
													paymentType === 'full' ? 'border-[#705D00]' : 'border-[#B0ACA0]'
												}`}>
												{paymentType === 'full' && (
													<div className="w-2.5 h-2.5 rounded-full bg-[#705D00]"></div>
												)}
											</div>
											<div>
												<p className="font-poppins font-semibold text-sm text-[#1A1C1C]">
													Pembayaran Penuh
												</p>
												<p className="font-poppins text-xs text-[#4D4732]">Opsi bayar lunas</p>
											</div>
										</div>
										<span className="font-poppins font-semibold text-lg text-[#1A1C1C]">
											Rp {parseInt(selectedService.price).toLocaleString('id-ID')}
										</span>
									</div>
								</div>
							</div>

							{/* Total & Submit */}
							<div className="mt-auto pt-6 border-t border-[#000000]/50">
								<div className="flex justify-between items-center mb-2">
									<span className="font-poppins text-base text-[#4D4732]">Harga Paket</span>
									<span className="font-poppins text-base text-[#4D4732]">
										Rp {parseInt(selectedService.price).toLocaleString('id-ID')}
									</span>
								</div>
								<div className="flex justify-between items-center mb-6">
									<span className="font-poppins font-semibold text-lg text-[#1A1C1C]">
										Total Bayar
									</span>
									<span className="font-poppins font-semibold text-2xl text-[#705E00]">
										Rp{' '}
										{(paymentType === 'dp'
											? parseInt(selectedService.price) / 2
											: parseInt(selectedService.price)
										).toLocaleString('id-ID')}
									</span>
								</div>

								{bookingError && (
									<div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-poppins">
										{bookingError}
									</div>
								)}

								<Button
									type="button"
									onClick={handleBooking}
									disabled={bookingLoading || !selectedTime}
									className="w-full h-[60px] rounded-[20px] bg-[#FFD700] hover:bg-[#e6c200] text-[#1A1C1C] font-poppins font-bold text-xl border-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
									{bookingLoading ? (
										<>
											<div className="w-5 h-5 border-2 border-[#1A1C1C] border-t-transparent rounded-full animate-spin"></div>
											Memproses...
										</>
									) : (
										'Konfirmasi Pembayaran'
									)}
								</Button>
								<p className="text-center font-poppins text-xs text-[#4D4732] mt-4">
									By clicking submit, you agree to our Terms of Service & Cancellation Policy.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
