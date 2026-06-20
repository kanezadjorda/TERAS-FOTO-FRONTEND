'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getAllBookingsAdmin, getBookingStats } from '@/lib/services/bookingService';
import { formatRupiah } from '@/utils/format';
import {
	Calendar,
	Clock,
	DollarSign,
	Eye,
	ChevronLeft,
	ChevronRight,
	Filter,
	Search,
} from 'lucide-react';
import { format as formatDate, parseISO } from 'date-fns';

const getStatusStyle = status => {
	switch (status) {
		case 'PENDING':
		case 'PENDING_PAYMENT':
			return 'bg-[#FFF9C4] text-[#705D00] border-[#FFF59D]';
		case 'CONFIRMED':
			return 'bg-[#E0F7FA] text-[#006064] border-[#B2EBF2]';
		case 'COMPLETED':
			return 'bg-[#E8E8E8] text-[#4D4732] border-[#D6D6D6]';
		case 'CANCELLED':
		case 'CANCELED':
			return 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]';
		default:
			return 'bg-gray-50 text-gray-500 border-gray-100';
	}
};

export default function AdminBookingsClient({ initialBookings, initialStats }) {
	const [activeTab, setActiveTab] = useState('All');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedService, setSelectedService] = useState('All');
	const [currentPage, setCurrentPage] = useState(1);

	const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

	// Fetch bookings from backend using SWR
	const {
		data: bookingsResponse,
		error,
		isLoading,
	} = useSWR(
		['/admin/bookings', currentPage, activeTab, searchQuery, selectedService],
		() =>
			getAllBookingsAdmin({
				page: currentPage,
				limit: 10,
				status: activeTab !== 'All' ? activeTab.toUpperCase() : undefined,
				search: searchQuery || undefined,
				service: selectedService !== 'All' ? selectedService : undefined,
			}),
		{
			fallbackData: (currentPage === 1 && activeTab === 'All' && searchQuery === '' && selectedService === 'All')
				? initialBookings
				: undefined,
		}
	);

	const { data: statResponse } = useSWR('/admin/bookings/stats', () => getBookingStats(), {
		fallbackData: initialStats,
	});

	const statsData = statResponse?.data || {};

	const backendBookings = bookingsResponse?.data || [];
	const paginationMeta = bookingsResponse?.meta?.pagination || {
		current_page: 1,
		total_pages: 1,
		total_items: 0,
		limit: 10,
	};

	// Map backend bookings to UI format
	const bookingsList = backendBookings.map(b => {
		let formattedDate = b.date;
		try {
			if (b.date) {
				formattedDate = formatDate(parseISO(b.date), 'MMM dd, yyyy');
			}
		} catch (e) {
			console.error('Error parsing date:', e);
		}

		return {
			id: b.id,
			client: {
				name: b.client?.name || 'Client',
				email: b.client?.email || 'client@example.com',
			},
			service: b.service || 'Service',
			date: formattedDate || 'N/A',
			time: b.time || '',
			status: b.status,
			price: b.price || 0,
		};
	});

	// Filter bookings based on activeTab, search query, and service type
	const filteredBookings = bookingsList.filter(booking => {
		const matchesTab =
			activeTab === 'All' || booking.status.toLowerCase() === activeTab.toLowerCase();
		const matchesSearch =
			booking.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			booking.client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			booking.service.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesService = selectedService === 'All' || booking.service === selectedService;

		return matchesTab && matchesSearch && matchesService;
	});

	return (
		<div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-12">
			{/* Top Metrics Grid (3 Cards) */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Card 1: Total Bookings */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[140px] relative overflow-hidden">
					<div className="flex justify-between items-start">
						<span className="font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
							Total Bookings
						</span>
						<div className="p-2 rounded-lg bg-gray-50 text-gray-400">
							<Calendar className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-2">
						{isLoading && !bookingsResponse ? (
							<div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
						) : (
							<span className="font-poppins font-bold text-3xl text-[#4D4732] block">
								{statsData.total_bookings || 0}
							</span>
						)}
						<span className="font-inter text-xs text-gray-400 mt-1 flex items-center gap-1 font-semibold">
							Total bookings based on current filters
						</span>
					</div>
				</div>

				{/* Card 2: Pending Approval */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[140px]">
					<div className="flex justify-between items-start">
						<span className="font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
							Pending Approval
						</span>
						<div className="p-2 rounded-lg bg-gray-50 text-gray-400">
							<Clock className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-2">
						{isLoading && !bookingsResponse ? (
							<div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
						) : (
							<span className="font-poppins font-bold text-3xl text-[#705D00] block">
								{String(statsData.pending_approval || 0).padStart(2, '0')}
							</span>
						)}
						<span className="font-inter text-xs text-amber-600 mt-1 flex items-center gap-1 font-semibold">
							Requires immediate attention
						</span>
					</div>
				</div>

				{/* Card 3: Revenue Forecast */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[140px]">
					<div className="flex justify-between items-start">
						<span className="font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
							Total Revenue Forecast
						</span>
						<div className="p-2 rounded-lg bg-gray-50 text-gray-400">
							<DollarSign className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-2">
						{isLoading && !bookingsResponse ? (
							<div className="h-8 w-40 bg-gray-200 rounded animate-pulse mt-1"></div>
						) : (
							<span className="font-poppins font-bold text-3xl text-[#4D4732] block">
								{formatRupiah(statsData.revenue_forecast || 0)}
							</span>
						)}
						<span className="font-inter text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
							🎯 Total revenue on this page
						</span>
					</div>
				</div>
			</div>

			{/* Title Section */}
			<div className="flex flex-col gap-1">
				<h1 className="font-poppins font-bold text-3xl md:text-[36px] text-[#111111] leading-tight tracking-tight">
					Manage Bookings
				</h1>
			</div>

			{/* Filter & Search Controls */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm">
				{/* Tabs Filter Status */}
				<div className="flex flex-wrap gap-1 bg-gray-100/80 p-1 rounded-2xl w-full lg:w-auto">
					{tabs.map(tab => (
						<button
							key={tab}
							onClick={() => {
								setActiveTab(tab);
								setCurrentPage(1);
							}}
							className={`px-4 py-2 rounded-xl font-poppins font-bold text-xs tracking-wide transition-all flex-1 lg:flex-none ${
								activeTab === tab
									? 'bg-white text-[#4D4732] shadow-sm'
									: 'text-gray-500 hover:text-gray-800'
							}`}>
							{tab}
						</button>
					))}
				</div>

				{/* Search & Dropdown Filters */}
				<div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
					{/* Search Input */}
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search client or service..."
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-poppins font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20 focus:border-[#705D00] transition-all"
						/>
					</div>

					{/* Date Picker Button (Mock) */}
					<button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm font-poppins font-bold text-xs tracking-wide w-full sm:w-auto justify-center">
						<Calendar className="w-4 h-4 text-gray-400" />
						Oct 24, 2023
					</button>

					{/* Service Type Dropdown */}
					<div className="relative w-full sm:w-auto">
						<select
							value={selectedService}
							onChange={e => setSelectedService(e.target.value)}
							className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-poppins font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20 focus:border-[#705D00] transition-all shadow-sm cursor-pointer">
							<option value="All">Service Type</option>
							<option value="Self Photo">Self Photo</option>
							<option value="Studio Portrait">Studio Portrait</option>
							<option value="Product Shoot">Product Shoot</option>
						</select>
						<Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
					</div>
				</div>
			</div>

			{/* Bookings Table Card */}
			<div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-gray-100">
								<th className="pb-4 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
									Client
								</th>
								<th className="pb-4 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
									Service
								</th>
								<th className="pb-4 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
									Date & Time
								</th>
								<th className="pb-4 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
									Status
								</th>
								<th className="pb-4 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
									Price
								</th>
								<th className="pb-4 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{isLoading && !bookingsResponse ? (
								// Skeleton Loading State
								Array.from({ length: 5 }).map((_, index) => (
									<tr key={`skeleton-${index}`} className="animate-pulse">
										<td className="py-4 flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-gray-200"></div>
											<div className="flex flex-col gap-2">
												<div className="h-4 w-24 bg-gray-200 rounded"></div>
												<div className="h-3 w-32 bg-gray-200 rounded"></div>
											</div>
										</td>
										<td className="py-4">
											<div className="h-7 w-20 bg-gray-200 rounded-xl"></div>
										</td>
										<td className="py-4">
											<div className="flex flex-col gap-2">
												<div className="h-4 w-20 bg-gray-200 rounded"></div>
												<div className="h-3 w-16 bg-gray-200 rounded"></div>
											</div>
										</td>
										<td className="py-4">
											<div className="h-7 w-24 bg-gray-200 rounded-full"></div>
										</td>
										<td className="py-4">
											<div className="h-4 w-16 bg-gray-200 rounded"></div>
										</td>
										<td className="py-4 text-right">
											<div className="h-8 w-8 bg-gray-200 rounded-xl inline-block"></div>
										</td>
									</tr>
								))
							) : filteredBookings.length > 0 ? (
								filteredBookings.map(booking => (
									<tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
										{/* Client Info */}
										<td className="py-4 flex items-center gap-3">
											<div className="flex flex-col">
												<span className="font-poppins font-bold text-sm text-[#111111]">
													{booking.client.name}
												</span>
												<span className="font-inter text-xs text-gray-400">
													{booking.client.email}
												</span>
											</div>
										</td>

										{/* Service Badge */}
										<td className="py-4">
											<span className="inline-block font-poppins font-bold text-xs text-[#705D00] bg-[#FAF8F0] px-3 py-1.5 rounded-xl border border-[#EFECE0]">
												{booking.service}
											</span>
										</td>

										{/* Date & Time */}
										<td className="py-4">
											<div className="flex flex-col">
												<span className="font-poppins font-bold text-sm text-[#111111]">
													{booking.date}
												</span>
												<span className="font-inter text-xs text-gray-400">{booking.time}</span>
											</div>
										</td>

										{/* Status Badge */}
										<td className="py-4">
											<span
												className={`inline-block font-poppins font-bold text-[10px] tracking-wider px-3 py-1.5 rounded-full border ${getStatusStyle(booking.status)}`}>
												{booking.status}
											</span>
										</td>

										{/* Price */}
										<td className="py-4 font-poppins font-bold text-sm text-[#111111]">
											{formatRupiah(booking.price)}
										</td>

										{/* Action Button */}
										<td className="py-4 text-right">
											<button aria-label="View booking details" className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#705D00] hover:border-[#705D00]/20 hover:bg-[#FAF8F0] transition-all shadow-sm">
												<Eye className="w-4 h-4" />
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="6" className="py-12 text-center">
										<div className="flex flex-col items-center justify-center gap-2">
											<span className="font-poppins font-bold text-sm text-gray-400">
												No bookings found
											</span>
											<span className="font-inter text-xs text-gray-400">
												Try adjusting your search or filter criteria
											</span>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination Section */}
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50 pt-6">
					<span className="font-inter text-xs text-gray-400">
						{backendBookings.length > 0
							? `Showing ${Math.min((currentPage - 1) * paginationMeta.limit + 1, paginationMeta.total_items)}-${Math.min(currentPage * paginationMeta.limit, paginationMeta.total_items)} of ${paginationMeta.total_items} bookings`
							: `Showing 1-${filteredBookings.length} of ${filteredBookings.length} bookings`}
					</span>

					<div className="flex items-center gap-1.5">
						<button
							onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
							<ChevronLeft className="w-4 h-4" />
						</button>

						{backendBookings.length > 0 ? (
							Array.from({ length: paginationMeta.total_pages }).map((_, i) => {
								const pageNum = i + 1;
								const isCurrent = pageNum === currentPage;
								return (
									<button
										key={pageNum}
										onClick={() => setCurrentPage(pageNum)}
										className={`w-8 h-8 flex items-center justify-center rounded-xl font-poppins font-bold text-xs transition-all shadow-sm ${
											isCurrent
												? 'bg-[#705D00] text-white'
												: 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
										}`}>
										{pageNum}
									</button>
								);
							})
						) : (
							<>
								<button className="w-8 h-8 flex items-center justify-center bg-[#705D00] text-white rounded-xl font-poppins font-bold text-xs shadow-sm">
									1
								</button>
								<button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 rounded-xl font-poppins font-bold text-xs transition-all shadow-sm">
									2
								</button>
								<button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 rounded-xl font-poppins font-bold text-xs transition-all shadow-sm">
									3
								</button>
							</>
						)}

						<button
							onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationMeta.total_pages))}
							disabled={currentPage === paginationMeta.total_pages}
							className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
