'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getAllBookingsAdmin } from '@/lib/services/bookingService';
import {
	format,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	getDay,
	parseISO,
} from 'date-fns';
import {
	ChevronLeft,
	ChevronRight,
	Plus,
	Calendar as CalendarIcon,
	MoreHorizontal,
	Users,
} from 'lucide-react';
import Image from 'next/image';

// Mock Data Event Kalender & Agenda (September 2024 sesuai gambar referensi)
const mockEvents = [
	{
		id: 1,
		title: 'Wedding: S...',
		fullTitle: 'Wedding: Siska & Rian',
		date: '2024-09-01',
		time: '10:00 - 15:00',
		category: 'wedding', // Wedding/Outdoor
		lead: 'Dimas Pratama',
		asst: 'Siti Aminah',
		avatars: [
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
		],
	},
	{
		id: 2,
		title: 'Self Photo',
		fullTitle: 'Self Photo: Group 4',
		date: '2024-09-03',
		time: '15:00 - 16:30',
		category: 'self-photo', // Self Photo/Portrait
		lead: 'Siti Aminah',
		asst: 'Siti Aminah',
		avatars: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'],
	},
	{
		id: 3,
		title: 'Product: Au...',
		fullTitle: 'Product: Aura Skin',
		date: '2024-09-04',
		time: '10:00 - 13:00',
		category: 'wedding', // Wedding/Outdoor (warna cokelat zaitun di gambar)
		lead: 'Dimas Pratama',
		asst: 'Siti Aminah',
		avatars: [
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
			'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
		],
	},
	{
		id: 4,
		title: 'Self Photo...',
		fullTitle: 'Self Photo: Group 4',
		date: '2024-09-04',
		time: '15:00 - 16:30',
		category: 'self-photo', // Self Photo/Portrait
		lead: 'Siti Aminah',
		asst: 'Siti Aminah',
		avatars: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'],
	},
	{
		id: 5,
		title: 'Engagemen...',
		fullTitle: 'Engagement: Riri & Fadel',
		date: '2024-09-10',
		time: '09:00 - 12:00',
		category: 'corporate', // Corporate/Events (warna toska di gambar)
		lead: 'Dimas Pratama',
		asst: 'Siti Aminah',
		avatars: [
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
			'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
		],
	},
];

// Kategori warna sesuai gambar referensi
const categoryStyles = {
	wedding: 'bg-[#705D00] text-white border-[#5c4b00]', // Wedding/Outdoor (Cokelat Zaitun)
	'self-photo': 'bg-[#FAF8F0] text-[#705D00] border-[#EFECE0]', // Self Photo/Portrait (Kuning Lembut)
	corporate: 'bg-[#006064] text-white border-[#004d40]', // Corporate/Events (Toska)
};

export default function SchedulePage() {
	const [currentDate, setCurrentPageDate] = useState(new Date()); // Default ke bulan ini
	const [selectedDate, setSelectedDate] = useState(new Date()); // Default ke hari ini
	const [viewMode, setViewMode] = useState('MONTH'); // MONTH, WEEK, DAY

	// Fetch data bookings dari backend (jika ada)
	const { data: backendBookings } = useSWR('/bookings', () => getAllBookingsAdmin());

	// Gabungkan data backend dengan mock data jika backend kosong
	const events = backendBookings?.data
		? [
				...mockEvents,
				...backendBookings.data.map(b => ({
					id: b.id,
					title: b.service?.service_name || 'Booking',
					fullTitle: `${b.service?.service_name || 'Booking'}: ${b.user?.full_name || 'Client'}`,
					date: b.booking_date
						? format(parseISO(b.booking_date), 'yyyy-MM-dd')
						: format(new Date(), 'yyyy-MM-dd'),
					time: `${b.start_time || '09:00'} - ${b.end_time || '10:00'}`,
					category: b.service?.service_name?.toLowerCase().includes('wedding')
						? 'wedding'
						: b.service?.service_name?.toLowerCase().includes('corporate')
							? 'corporate'
							: 'self-photo',
					lead: 'Dimas Pratama',
					asst: 'Siti Aminah',
					avatars: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'],
				})),
			]
		: mockEvents;

	// Logika Kalender menggunakan date-fns
	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(monthStart);
	const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

	// Dapatkan hari pertama dalam sebulan untuk menentukan offset grid
	const startDayOfWeek = getDay(monthStart);

	// Navigasi Bulan
	const nextMonth = () => setCurrentPageDate(addMonths(currentDate, 1));
	const prevMonth = () => setCurrentPageDate(subMonths(currentDate, 1));

	// Filter agenda hari ini berdasarkan tanggal yang dipilih
	const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
	const todaysAgenda = events.filter(event => event.date === selectedDateStr);

	return (
		<div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto pb-12">
			{/* KIRI: Kalender View */}
			<div className="flex-1 bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
				{/* Header Kalender */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-4">
						<h1 className="font-poppins font-bold text-2xl md:text-3xl text-[#111111] leading-none">
							{format(currentDate, 'MMMM yyyy')}
						</h1>
						<div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
							<button
								onClick={prevMonth}
								className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-600 hover:text-gray-900">
								<ChevronLeft className="w-4 h-4" />
							</button>
							<button
								onClick={nextMonth}
								className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-600 hover:text-gray-900">
								<ChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>

					<div className="flex items-center gap-3 w-full sm:w-auto">
						{/* View Mode Toggle */}
						<div className="flex bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto">
							{['MONTH', 'WEEK', 'DAY'].map(mode => (
								<button
									key={mode}
									onClick={() => setViewMode(mode)}
									className={`px-4 py-1.5 rounded-lg font-poppins font-bold text-[10px] tracking-wider transition-all flex-1 sm:flex-none ${
										viewMode === mode
											? 'bg-white text-[#4D4732] shadow-sm'
											: 'text-gray-400 hover:text-gray-700'
									}`}>
									{mode}
								</button>
							))}
						</div>

						{/* Add Manual Entry Button */}
						<button className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#F9E485] hover:bg-[#f7dc5f] text-[#4D4732] font-poppins font-bold text-[10px] tracking-wider rounded-xl transition-all shadow-sm uppercase whitespace-nowrap">
							<Plus className="w-3.5 h-3.5" />
							Add Manual Entry
						</button>
					</div>
				</div>

				{/* Grid Kalender */}
				<div className="flex flex-col">
					{/* Header Hari */}
					<div className="grid grid-cols-7 text-center border-b border-gray-100 pb-3">
						{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
							<span
								key={day}
								className="font-inter text-[10px] font-bold text-gray-400 tracking-wider">
								{day}
							</span>
						))}
					</div>

					{/* Sel Tanggal */}
					<div className="grid grid-cols-7 mt-2">
						{/* Offset untuk hari pertama dalam sebulan */}
						{Array.from({ length: startDayOfWeek }).map((_, index) => (
							<div
								key={`empty-${index}`}
								className="min-h-[100px] border-b border-r border-gray-50 p-2 bg-gray-50/20"></div>
						))}

						{/* Hari-hari dalam sebulan */}
						{daysInMonth.map(day => {
							const dateStr = format(day, 'yyyy-MM-dd');
							const dayEvents = events.filter(event => event.date === dateStr);
							const isSelected = isSameDay(day, selectedDate);
							const isCurrentMonth = isSameMonth(day, currentDate);

							return (
								<div
									key={day.toString()}
									onClick={() => setSelectedDate(day)}
									className={`min-h-[100px] border-b border-r border-gray-50 p-2 flex flex-col gap-1 cursor-pointer transition-all hover:bg-gray-50/50 ${
										isSelected ? 'bg-[#FAF8F0]/60 border-[#EFECE0]' : ''
									} ${!isCurrentMonth ? 'opacity-30' : ''}`}>
									{/* Angka Tanggal */}
									<span
										className={`font-poppins font-bold text-xs self-start w-6 h-6 flex items-center justify-center rounded-full ${
											isSelected ? 'bg-[#705D00] text-white' : 'text-[#4D4732]'
										}`}>
										{format(day, 'd')}
									</span>

									{/* Event Badges */}
									<div className="flex flex-col gap-1 mt-1 overflow-hidden">
										{dayEvents.map(event => (
											<div
												key={event.id}
												title={event.fullTitle}
												className={`px-1.5 py-0.5 rounded text-[9px] font-poppins font-bold truncate border ${
													event.category === 'wedding'
														? 'bg-[#705D00] text-white border-[#5c4b00]'
														: event.category === 'corporate'
															? 'bg-[#006064] text-white border-[#004d40]'
															: 'bg-[#FAF8F0] text-[#705D00] border-[#EFECE0]'
												}`}>
												{event.title}
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Legend */}
				<div className="flex flex-wrap items-center gap-6 border-t border-gray-50 pt-6">
					<span className="font-inter text-[10px] font-bold text-gray-400 tracking-wider uppercase">
						Legend:
					</span>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-[#705D00]"></span>
						<span className="font-inter text-xs text-gray-600 font-medium">Wedding/Outdoor</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-[#FAF8F0] border border-[#EFECE0]"></span>
						<span className="font-inter text-xs text-gray-600 font-medium">
							Self Photo/Portrait
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-[#006064]"></span>
						<span className="font-inter text-xs text-gray-600 font-medium">Corporate/Events</span>
					</div>
				</div>
			</div>

			{/* KANAN: Today's Agenda & Stats */}
			<div className="w-full lg:w-[380px] flex flex-col gap-6">
				{/* Today's Agenda Card */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col gap-6 flex-1">
					<div className="flex flex-col gap-1 border-b border-gray-50 pb-4">
						<h2 className="font-poppins font-bold text-lg text-[#111111]">Todays Agenda</h2>
						<span className="font-inter text-xs text-gray-400">
							{format(selectedDate, 'EEEE, d MMMM yyyy')}
						</span>
					</div>

					{/* Agenda List */}
					<div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-1">
						{todaysAgenda.length > 0 ? (
							todaysAgenda.map(agenda => (
								<div
									key={agenda.id}
									className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all relative group">
									{/* Time Badge */}
									<div className="flex justify-between items-center">
										<span className="px-2.5 py-1 bg-[#FAF8F0] text-[#705D00] border border-[#EFECE0] rounded-lg font-poppins font-bold text-[10px] tracking-wider">
											{agenda.time}
										</span>
										<button className="text-gray-400 hover:text-gray-600">
											<MoreHorizontal className="w-4 h-4" />
										</button>
									</div>

									{/* Title & Lead */}
									<div className="flex flex-col gap-1">
										<h3 className="font-poppins font-bold text-sm text-[#111111]">
											{agenda.fullTitle}
										</h3>
										<span className="font-inter text-xs text-gray-500 flex items-center gap-1">
											<Users className="w-3.5 h-3.5 text-gray-400" /> Lead: {agenda.lead}
										</span>
									</div>

									{/* Avatars */}
									<div className="flex items-center gap-1.5 mt-1">
										<div className="flex -space-x-2 overflow-hidden">
											{agenda.avatars.map((avatar, i) => (
												<div
													key={i}
													className="inline-block h-6 w-6 rounded-full ring-2 ring-white relative overflow-hidden bg-gray-100">
													<Image
														src={avatar}
														alt="Team Avatar"
														fill
														sizes="24px"
														className="object-cover"
													/>
												</div>
											))}
										</div>
										{agenda.avatars.length > 2 && (
											<span className="text-[10px] font-poppins font-bold text-[#705D00] bg-[#FAF8F0] px-1.5 py-0.5 rounded border border-[#EFECE0]">
												+{agenda.avatars.length - 2}
											</span>
										)}
									</div>
								</div>
							))
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 gap-3">
								<div className="p-3 bg-white rounded-full shadow-sm text-gray-400">
									<CalendarIcon className="w-5 h-5" />
								</div>
								<div className="flex flex-col gap-1">
									<span className="font-poppins font-bold text-xs text-gray-500">
										No more sessions for today.
									</span>
									<span className="font-inter text-[11px] text-gray-400">
										Enjoy your free time or add a manual entry.
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Studio Capacity Card */}
				<div className="bg-[#705D00] text-white rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<span className="font-inter text-[10px] font-bold text-white/60 tracking-wider uppercase">
							Studio Capacity
						</span>
						<h3 className="font-poppins font-bold text-2xl">65% Booked</h3>
					</div>

					{/* Progress Bar */}
					<div className="w-full bg-white/20 rounded-full h-2">
						<div className="bg-white h-2 rounded-full" style={{ width: '65%' }}></div>
					</div>

					<button className="w-full py-3 bg-white hover:bg-gray-50 text-[#705D00] font-poppins font-bold text-xs tracking-wider rounded-xl transition-colors uppercase mt-2 shadow-sm">
						View Studio Stats
					</button>
				</div>
			</div>
		</div>
	);
}
