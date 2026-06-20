'use client';

import useSWR from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import { formatRupiah } from '@/utils/format';
import {
	getDashboardStats,
	getRecentBookings,
	getWeeklyFlow,
} from '@/lib/services/analyticsService';
import {
	Bell,
	Camera,
	CreditCard,
	TrendingUp,
	ChevronLeft,
	ChevronRight,
	TrendingUp as GrowthIcon,
	AlertCircle,
} from 'lucide-react';

export default function AdminDashboardClient({
	initialStats,
	initialRecentBookings,
	initialWeeklyFlow,
}) {
	const { user } = useAuth();

	// Fetch dashboard stats, recent bookings, and weekly flow using SWR with initial server-side data
	const {
		data: statsRes,
		error: statsError,
		isLoading: statsLoading,
	} = useSWR('admin/dashboard/stats', () => getDashboardStats(), {
		fallbackData: initialStats,
	});

	const {
		data: recentRes,
		error: recentError,
		isLoading: recentLoading,
	} = useSWR('admin/dashboard/recent-bookings', () => getRecentBookings(), {
		fallbackData: initialRecentBookings,
	});

	const {
		data: weeklyRes,
		error: weeklyError,
		isLoading: weeklyLoading,
	} = useSWR('admin/dashboard/weekly-flow', () => getWeeklyFlow(), {
		fallbackData: initialWeeklyFlow,
	});

	const stats = statsRes?.data || {};
	const recentBookings = recentRes?.data || [];
	const weeklyFlow = weeklyRes?.data || [];

	const isLoading = statsLoading || recentLoading || weeklyLoading;
	const error = statsError || recentError || weeklyError;

	// Helper function to map status to color
	const getStatusColor = status => {
		switch (status?.toUpperCase()) {
			case 'PAID':
				return 'bg-emerald-50 text-emerald-600 border-emerald-100';
			case 'CONFIRMED':
				return 'bg-blue-50 text-blue-600 border-blue-100';
			case 'PENDING':
				return 'bg-amber-50 text-amber-600 border-amber-100';
			case 'CANCELLED':
				return 'bg-rose-50 text-rose-600 border-rose-100';
			default:
				return 'bg-gray-50 text-gray-600 border-gray-100';
		}
	};

	if (isLoading && !statsRes && !recentRes && !weeklyRes) {
		return (
			<div className="flex flex-col gap-8 animate-pulse">
				{/* Header Skeleton */}
				<div className="flex justify-between items-center">
					<div className="flex flex-col gap-2">
						<div className="h-10 bg-gray-200 rounded-lg w-48"></div>
						<div className="h-5 bg-gray-200 rounded-lg w-80"></div>
					</div>
					<div className="flex items-center gap-4">
						<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
						<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
					</div>
				</div>

				{/* Stat Cards Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[1, 2, 3].map(i => (
						<div
							key={i}
							className="bg-white border border-gray-100 rounded-2xl p-6 h-36 flex flex-col justify-between shadow-sm">
							<div className="flex justify-between">
								<div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
								<div className="w-16 h-6 bg-gray-200 rounded-full"></div>
							</div>
							<div className="h-8 bg-gray-200 rounded w-24"></div>
							<div className="h-4 bg-gray-200 rounded w-36"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error && !statsRes && !recentRes && !weeklyRes) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-6">
				<div className="p-4 bg-red-50 text-red-600 rounded-full">
					<AlertCircle className="w-12 h-12" />
				</div>
				<h2 className="font-poppins font-bold text-xl text-gray-800">Gagal Memuat Data</h2>
				<p className="font-inter text-gray-500 max-w-md">
					{error.message || 'Terjadi kesalahan saat mengambil data analisis dari server.'}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="font-poppins font-bold text-3xl md:text-[36px] text-[#4D4732] leading-tight tracking-tight">
						Overview
					</h1>
					<p className="font-inter text-sm text-[#4D4732]/70">
						Welcome back, {user?.full_name || 'Admin'}. Here&apos;s what&apos;s happening today.
					</p>
				</div>
				<div className="flex items-center gap-3 self-end md:self-auto">
					<button className="p-2.5 bg-white border border-gray-100 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm relative">
						<Bell className="w-5 h-5" />
						<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
					</button>
					<div className="flex items-center gap-3 bg-white border border-gray-100 rounded-full py-1.5 pl-2 pr-4 shadow-sm">
						<div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
							{/* avatar placeholder or img element if needed */}
						</div>
						<span className="font-inter text-sm font-semibold text-[#4D4732]">
							{user?.full_name?.split(' ')[0] || 'Admin'}
						</span>
					</div>
				</div>
			</div>

			{/* Stat Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Card 1: Total Bookings */}
				<div className="bg-[#FAF8F0] border border-[#EFECE0] rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[160px]">
					<div className="flex justify-between items-start">
						<div className="p-3 rounded-xl bg-white text-[#705D00] shadow-sm">
							<Camera className="w-5 h-5" />
						</div>
						<span className="font-poppins font-bold text-[10px] tracking-wider text-[#705D00] bg-[#F3EFC4] px-2.5 py-1 rounded-full uppercase">
							Total
						</span>
					</div>
					<div className="mt-4">
						<span className="font-inter text-xs font-medium text-gray-500 block">
							Total Bookings
						</span>
						<span className="font-poppins font-bold text-3xl text-[#4D4732] mt-1 block">
							{stats.total_bookings || 0}
						</span>
					</div>
					<span className="font-inter text-xs text-emerald-600 mt-2 flex items-center gap-1">
						✓ +{stats.total_bookings_growth || 0}% growth this month
					</span>
				</div>

				{/* Card 2: Active Clients */}
				<div className="bg-[#FFF5F5] border border-[#FFE3E3] rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[160px]">
					<div className="flex justify-between items-start">
						<div className="p-3 rounded-xl bg-white text-red-600 shadow-sm">
							<CreditCard className="w-5 h-5" />
						</div>
						<span className="font-poppins font-bold text-[10px] tracking-wider text-red-600 bg-[#FFE3E3] px-2.5 py-1 rounded-full uppercase">
							Clients
						</span>
					</div>
					<div className="mt-4">
						<span className="font-inter text-xs font-medium text-gray-500 block">
							Active Clients
						</span>
						<span className="font-poppins font-bold text-3xl text-[#4D4732] mt-1 block">
							{stats.active_clients || 0}
						</span>
					</div>
					<span className="font-inter text-xs text-emerald-600 mt-2 flex items-center gap-1">
						✓ +{stats.active_clients_growth || 0}% growth
					</span>
				</div>

				{/* Card 3: Total Revenue */}
				<div className="bg-[#FAF8F0] border border-[#EFECE0] rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[160px]">
					<div className="flex justify-between items-start">
						<div className="p-3 rounded-xl bg-white text-[#705D00] shadow-sm">
							<TrendingUp className="w-5 h-5" />
						</div>
						<span className="font-poppins font-bold text-[10px] tracking-wider text-[#705D00] bg-[#F3EFC4] px-2.5 py-1 rounded-full uppercase">
							Revenue
						</span>
					</div>
					<div className="mt-4">
						<span className="font-inter text-xs font-medium text-gray-500 block">
							Total Revenue
						</span>
						<span className="font-poppins font-bold text-2xl text-[#4D4732] mt-1 block">
							{stats.total_revenue ? formatRupiah(stats.total_revenue) : 'Rp 0'}
						</span>
					</div>
					<span className="font-inter text-xs text-emerald-600 mt-2 flex items-center gap-1">
						🎯 +{stats.total_revenue_growth || 0}% growth
					</span>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left: Recent Reservations */}
				<div className="lg:col-span-2 bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
					<div className="flex justify-between items-center border-b border-gray-50 pb-4">
						<h2 className="font-poppins font-bold text-lg md:text-xl text-[#4D4732]">
							Recent Reservations
						</h2>
						<button className="font-inter text-xs font-semibold text-[#705D00] hover:underline">
							View All
						</button>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-gray-100">
									<th className="pb-3 font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Client
									</th>
									<th className="pb-3 font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Service
									</th>
									<th className="pb-3 font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Date
									</th>
									<th className="pb-3 font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{recentBookings.length > 0 ? (
									recentBookings.map(res => (
										<tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
											<td className="py-4 font-poppins font-bold text-sm text-[#4D4732]">
												{res.client_name}
											</td>
											<td className="py-4 font-inter text-sm text-gray-500">{res.service_name}</td>
											<td className="py-4 font-inter text-sm text-gray-500">{res.booking_date}</td>
											<td className="py-4 text-right">
												<span
													className={`inline-block font-poppins font-bold text-[10px] tracking-wider px-2.5 py-1 rounded-full border ${getStatusColor(res.status)}`}>
													{res.status}
												</span>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="4" className="py-8 text-center text-gray-400 text-sm">
											Belum ada reservasi terbaru.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Right: Weekly Flow */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
					<div className="flex justify-between items-center border-b border-gray-50 pb-4">
						<h2 className="font-poppins font-bold text-lg text-[#4D4732]">Weekly Flow</h2>
						<div className="flex items-center gap-1">
							<button className="p-1 hover:bg-gray-100 rounded transition-colors">
								<ChevronLeft className="w-4 h-4 text-gray-500" />
							</button>
							<button className="p-1 hover:bg-gray-100 rounded transition-colors">
								<ChevronRight className="w-4 h-4 text-gray-500" />
							</button>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						{weeklyFlow.length > 0 ? (
							weeklyFlow.map(flow => (
								<div
									key={flow.id}
									className="flex gap-4 p-4 rounded-2xl border bg-gray-50 border-gray-100 transition-all hover:scale-[1.01]">
									<div className="flex flex-col items-center justify-center min-w-[45px] border-r border-gray-200/60 pr-4">
										<span className="font-inter text-[10px] font-bold text-gray-400 tracking-wider">
											{flow.day}
										</span>
										<span className="font-poppins font-bold text-lg text-[#4D4732] leading-none mt-1">
											{flow.date}
										</span>
									</div>
									<div className="flex flex-col justify-center">
										<span className="font-poppins font-bold text-[10px] tracking-wider text-[#705D00] block">
											{flow.service_name}
										</span>
										<span className="font-poppins font-bold text-sm text-[#4D4732] mt-0.5 block">
											{flow.client_name}
										</span>
										{flow.time_slot && (
											<span className="font-inter text-xs text-gray-400 mt-1 block">
												🕒 {flow.time_slot}
											</span>
										)}
									</div>
								</div>
							))
						) : (
							<div className="py-8 text-center text-gray-400 text-sm">
								Tidak ada jadwal untuk minggu ini.
							</div>
						)}
					</div>

					<button className="w-full py-3 border border-gray-200 hover:border-gray-300 text-gray-600 font-poppins font-bold text-xs tracking-wider rounded-xl transition-colors uppercase mt-2">
						Full Calendar View
					</button>
				</div>
			</div>

			{/* Bottom Section Grid */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
				{/* Left: Studio Capacity Card */}
				<div className="md:col-span-2 relative rounded-3xl overflow-hidden min-h-50 flex flex-col justify-end p-6 group shadow-sm">
					{/* Dark Overlay */}
					<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

					<div className="relative z-10 text-white">
						<h3 className="font-poppins font-bold text-2xl">Studio Capacity: 85%</h3>
						<p className="font-inter text-xs text-white/80 mt-1">
							Busy week ahead. Recommend opening slots for weekend sessions.
						</p>
					</div>
				</div>

				{/* Right: Growth Insight Card */}
				<div className="md:col-span-3 bg-[#E2E2E2]/60 border border-gray-200/40 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start shadow-sm">
					<div className="p-4 rounded-2xl bg-[#705D00] text-white shadow-md">
						<GrowthIcon className="w-6 h-6" />
					</div>
					<div className="flex-1 flex flex-col gap-4">
						<div>
							<h3 className="font-poppins font-bold text-lg text-[#4D4732]">Growth Insight</h3>
							<p className="font-inter text-sm text-gray-600 mt-1">
								Your portrait bookings are up 40% this month.
							</p>
						</div>
						<p className="font-inter text-sm text-gray-500 leading-relaxed">
							Based on your current trajectory, we recommend featuring more portrait work in your
							public catalog to capitalize on the trend.
						</p>
						<div className="flex items-center gap-3 mt-2">
							<button className="px-5 py-2.5 bg-[#705D00] hover:bg-[#5c4b00] text-white font-poppins font-bold text-xs tracking-wider rounded-xl transition-colors uppercase">
								Update Catalog
							</button>
							<button className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 font-poppins font-bold text-xs tracking-wider rounded-xl transition-colors uppercase">
								Dismiss
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
