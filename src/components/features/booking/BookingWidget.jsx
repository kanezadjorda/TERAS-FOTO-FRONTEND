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
import CalendarGrid from './CalendarGrid';
import TimeSlotSelector from './TimeSlotSelector';
import BookingSummaryPanel from './BookingSummaryPanel';

// SWR fetcher wrapper
const fetcher = url => api.get(url);

const EMPTY_ARRAY = [];

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
	const [bookingLoading, setBookingLoading] = useState(false);
	const [bookingError, setBookingLoadingError] = useState('');

	// Fetch Services
	const {
		data: servicesResponse,
		error: servicesError,
		isLoading: servicesLoading,
	} = useSWR('/services', fetcher);

	const services = servicesResponse?.data || EMPTY_ARRAY;

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

	// Fetch Occupied Slots when selectedService or currentMonth changes using useSWR
	const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
	const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
	const roomId = selectedService?.room_id;

	const { data: occupiedSlotsRes } = useSWR(
		selectedService
			? `/bookings/availability?start_date=${start}&end_date=${end}&room_id=${roomId}`
			: null,
		fetcher
	);
	const occupiedSlots = occupiedSlotsRes?.data || EMPTY_ARRAY;

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
									aria-label="Previous Month"
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
									aria-label="Next Month"
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
						<CalendarGrid
							currentMonth={currentMonth}
							selectedDate={selectedDate}
							onDateSelect={day => {
								setSelectedDate(day);
								setSelectedTime('');
							}}
							startingDayIndex={startingDayIndex}
							daysInMonth={daysInMonth}
							localeID={localeID}
						/>

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
					<TimeSlotSelector
						timeSlots={timeSlots}
						selectedTime={selectedTime}
						onTimeSelect={setSelectedTime}
						isSlotDisabled={isSlotDisabled}
					/>
				</div>

				{/* Sisi Kanan: Summary Card (5 Cols) */}
				<div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 bg-[#F3F3F4]">
					<BookingSummaryPanel
						selectedService={selectedService}
						selectedDate={selectedDate}
						selectedTime={selectedTime}
						paymentType={paymentType}
						setPaymentType={setPaymentType}
						bookingError={bookingError}
						bookingLoading={bookingLoading}
						onBookingSubmit={handleBooking}
						onChangeService={() => setSelectedService(null)}
						localeID={localeID}
					/>
				</div>
			</div>
		</div>
	);
}
