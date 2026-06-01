'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
	getAnalytics,
	getRevenueTrend,
	getBookingShare,
	getTopPackages,
	getPeakHours,
	getDashboardStats,
} from '@/lib/services/analyticsService';
import { formatRupiah } from '@/utils/format';
import {
	Calendar,
	Download,
	TrendingUp,
	Users,
	Sparkles,
	DollarSign,
	Camera,
	Clock,
	AlertCircle,
} from 'lucide-react';
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	PieChart,
	Pie,
	Cell,
} from 'recharts';

// Mock Data Fallback sesuai gambar referensi
const mockRevenueTrend = [
	{ month: 'JAN', revenue: 12000000 },
	{ month: 'FEB', revenue: 14000000 },
	{ month: 'MAR', revenue: 13000000 },
	{ month: 'APR', revenue: 18000000 },
	{ month: 'MAY', revenue: 28000000 },
	{ month: 'JUN', revenue: 22000000 },
	{ month: 'JUL', revenue: 16000000 },
	{ month: 'AUG', revenue: 24000000 },
	{ month: 'SEP', revenue: 45000000 },
	{ month: 'OCT', revenue: 38000000 },
	{ month: 'NOV', revenue: 32000000 },
	{ month: 'DEC', revenue: 40000000 },
];

const mockBookingShare = [
	{ name: 'Self Photo', value: 62, color: '#F9E485' },
	{ name: 'Graduation', value: 20, color: '#705D00' },
	{ name: 'Pre-Wedding', value: 18, color: '#D4C585' },
];

const mockTopPackages = [
	{
		id: 1,
		name: 'Solo Studio Basic',
		sales: 42,
		revenue: 12600000,
		growth: '+18%',
		icon: Sparkles,
	},
	{
		id: 2,
		name: 'Group Fun (4 Pax)',
		sales: 28,
		revenue: 10500000,
		growth: '+12%',
		icon: Users,
	},
	{
		id: 3,
		name: 'Graduation Elite',
		sales: 15,
		revenue: 8250000,
		growth: '+24%',
		icon: Camera,
	},
];

const mockPeakHours = [
	{ hour: '10AM', count: 10 },
	{ hour: '12PM', count: 15 },
	{ hour: '2PM', count: 35 },
	{ hour: '4PM', count: 40 },
	{ hour: '6PM', count: 20 },
	{ hour: '8PM', count: 8 },
];

export default function AnalyticsPage() {
	const [timeRange, setTimeRange] = useState('30days');
	const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());

	// Fetch analytics data using SWR
	const {
		data,
		error,
		isLoading: isAnalyticsLoading,
	} = useSWR('/admin/analytics', () => getAnalytics());

	// Fetch dashboard stats for top metrics
	const { data: statsData, isLoading: isStatsLoading } = useSWR('/admin/dashboard/stats', () =>
		getDashboardStats(),
	);

	// Fetch revenue trend
	const { data: revenueTrendRes, isLoading: isRevenueLoading } = useSWR(
		['/admin/analytics/revenue-trend', revenueYear],
		() => getRevenueTrend(revenueYear),
	);

	// Fetch booking share
	const { data: bookingShareRes, isLoading: isShareLoading } = useSWR(
		'/admin/analytics/booking-share',
		() => getBookingShare(),
	);

	// Fetch top packages
	const { data: topPackagesRes, isLoading: isPackagesLoading } = useSWR(
		'/admin/analytics/top-packages',
		() => getTopPackages(),
	);

	// Fetch peak hours
	const { data: peakHoursRes, isLoading: isPeakLoading } = useSWR(
		'/admin/analytics/peak-hours',
		() => getPeakHours(),
	);

	const isLoading =
		isAnalyticsLoading ||
		isStatsLoading ||
		isRevenueLoading ||
		isShareLoading ||
		isPackagesLoading ||
		isPeakLoading;

	// Extract data from response
	const analyticsData = data?.data || {};
	const stats = statsData?.data || {};

	// Gunakan data dari getDashboardStats jika ada, fallback ke getAnalytics
	const totalRevenue = stats.totalRevenue || analyticsData.totalRevenue || 0;
	const totalCompletedBookings =
		stats.totalCompletedBookings || analyticsData.totalCompletedBookings || 0;
	const servicePerformance = analyticsData.servicePerformance || [];

	// Map API data to UI format if available, otherwise use mock
	const revenueTrendData =
		revenueTrendRes?.data && revenueTrendRes.data.length > 0
			? revenueTrendRes.data.map(item => ({
					month: item.month,
					revenue: item.revenue,
				}))
			: mockRevenueTrend;

	// Map service performance dari API ke Booking Share
	const bookingShareData =
		bookingShareRes?.data && bookingShareRes.data.length > 0
			? bookingShareRes.data.map((item, index) => {
					// Gunakan item.value langsung dari API jika ada, jika tidak coba hitung dari percentage atau booking_count
					let val = 0;
					if (typeof item.value === 'number') {
						val = item.value;
					} else if (typeof item.percentage === 'number') {
						val = item.percentage;
					} else if (typeof item.booking_count === 'number') {
						val = (item.booking_count / (totalCompletedBookings || 1)) * 100;
					}
					return {
						name: item.name || item.service_name || `Layanan ${index + 1}`,
						value: Math.round(val) || 0,
						color: index === 0 ? '#F9E485' : index === 1 ? '#705D00' : '#D4C585',
					};
				})
			: servicePerformance.length > 0
				? servicePerformance.map((item, index) => ({
						name: item.service_name,
						value: Math.round((item.booking_count / (totalCompletedBookings || 1)) * 100) || 0,
						color: index === 0 ? '#F9E485' : index === 1 ? '#705D00' : '#D4C585',
					}))
				: mockBookingShare;

	const topPackagesData =
		topPackagesRes?.data && topPackagesRes.data.length > 0
			? topPackagesRes.data.map((item, index) => ({
					id: index + 1,
					name: item.service_name || item.name,
					sales: item.booking_count || item.sales,
					revenue: item.total_revenue || item.revenue,
					growth: item.growth || (index === 0 ? '+18%' : index === 1 ? '+12%' : '+24%'),
					icon: index === 0 ? Sparkles : index === 1 ? Users : Camera,
				}))
			: servicePerformance.length > 0
				? servicePerformance.map((item, index) => ({
						id: index + 1,
						name: item.service_name,
						sales: item.booking_count,
						revenue: item.total_revenue,
						growth: index === 0 ? '+18%' : index === 1 ? '+12%' : '+24%',
						icon: index === 0 ? Sparkles : index === 1 ? Users : Camera,
					}))
				: mockTopPackages;

	const peakHoursData =
		peakHoursRes?.data && peakHoursRes.data.length > 0
			? peakHoursRes.data.map(item => ({
					hour: item.hour,
					count: item.count,
				}))
			: mockPeakHours;

	if (isLoading) {
		return (
			<div className="flex flex-col gap-8 animate-pulse max-w-[1400px] mx-auto">
				{/* Header Skeleton */}
				<div className="flex justify-between items-center">
					<div className="flex flex-col gap-2">
						<div className="h-10 bg-gray-200 rounded-lg w-64"></div>
						<div className="h-5 bg-gray-200 rounded-lg w-96"></div>
					</div>
					<div className="flex gap-3">
						<div className="w-32 h-10 bg-gray-200 rounded-xl"></div>
						<div className="w-32 h-10 bg-gray-200 rounded-xl"></div>
					</div>
				</div>

				{/* Metrics Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map(i => (
						<div
							key={i}
							className="bg-white border border-gray-100 rounded-2xl p-6 h-32 flex flex-col justify-between shadow-sm">
							<div className="h-4 bg-gray-200 rounded w-24"></div>
							<div className="h-8 bg-gray-200 rounded w-32"></div>
							<div className="h-4 bg-gray-200 rounded w-20"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-6">
				<div className="p-4 bg-red-50 text-red-600 rounded-full">
					<AlertCircle className="w-12 h-12" />
				</div>
				<h2 className="font-poppins font-bold text-xl text-gray-800">Gagal Memuat Data Analitik</h2>
				<p className="font-inter text-gray-500 max-w-md">
					{error.message || 'Terjadi kesalahan saat mengambil data analisis dari server.'}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-12">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="font-poppins font-bold text-3xl md:text-[36px] text-[#705D00] leading-tight tracking-tight">
						Studio Performance
					</h1>
					<p className="font-inter text-sm text-gray-500">
						Track your creative growth and sales momentum in real-time.
					</p>
				</div>
				<div className="flex items-center gap-3 self-end md:self-auto">
					<button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm font-poppins font-bold text-xs tracking-wide">
						<Calendar className="w-4 h-4 text-gray-400" />
						Last 30 Days
					</button>
					<button className="flex items-center gap-2 px-4 py-2.5 bg-[#705D00] hover:bg-[#5c4b00] text-white rounded-xl transition-colors shadow-sm font-poppins font-bold text-xs tracking-wide uppercase">
						<Download className="w-4 h-4" />
						Export PDF
					</button>
				</div>
			</div>

			{/* Top Metrics Grid (4 Cards) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Card 1: Monthly Revenue */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[140px] relative overflow-hidden">
					<div className="flex justify-between items-start">
						<span className="font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
							Monthly Revenue
						</span>
						<div className="p-2 rounded-lg bg-gray-50 text-gray-400">
							<DollarSign className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-2">
						<span className="font-poppins font-bold text-2xl text-[#4D4732] block">
							{totalRevenue > 0 ? formatRupiah(totalRevenue) : 'Rp 42.8M'}
						</span>
						<span className="font-inter text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
							<TrendingUp className="w-3.5 h-3.5" /> +12.5%
						</span>
					</div>
				</div>

				{/* Card 2: Total Sessions */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[140px]">
					<div className="flex justify-between items-start">
						<span className="font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
							Total Sessions
						</span>
						<div className="p-2 rounded-lg bg-gray-50 text-gray-400">
							<Camera className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-2">
						<span className="font-poppins font-bold text-2xl text-[#4D4732] block">
							{totalCompletedBookings || 184}
						</span>
						<span className="font-inter text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
							<TrendingUp className="w-3.5 h-3.5" /> +8%
						</span>
					</div>
				</div>

				{/* Card 3: Customer Retention */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[140px]">
					<div className="flex justify-between items-start">
						<span className="font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
							Customer Retention
						</span>
						<div className="p-2 rounded-lg bg-gray-50 text-gray-400">
							<Users className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-2">
						<span className="font-poppins font-bold text-2xl text-[#4D4732] block">68%</span>
						<span className="font-inter text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
							<TrendingUp className="w-3.5 h-3.5" /> +5.2%
						</span>
					</div>
				</div>

				{/* Card 4: Top Service (Solid Yellow) */}
				<div className="bg-[#F9E485] rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all min-h-[140px] text-[#4D4732]">
					<div className="flex justify-between items-start">
						<span className="font-inter text-xs font-bold text-[#4D4732]/70 uppercase tracking-wider">
							Top Service
						</span>
						<div className="p-2 rounded-lg bg-white/30 text-[#4D4732]">
							<Sparkles className="w-4 h-4" />
						</div>
					</div>
					<div className="mt-2">
						<span className="font-poppins font-bold text-2xl block">
							{servicePerformance[0]?.service_name || 'Self Photo'}
						</span>
						<span className="font-inter text-xs text-[#4D4732]/80 mt-1 block font-medium">
							{servicePerformance[0]
								? `${Math.round((servicePerformance[0].booking_count / (totalCompletedBookings || 1)) * 100)}% of total bookings`
								: '62% of total bookings'}
						</span>
					</div>
				</div>
			</div>

			{/* Charts Section (Revenue Trend & Booking Share) */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left: Revenue Trend (Line Chart) */}
				<div className="lg:col-span-2 bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
					<div className="flex justify-between items-center">
						<h2 className="font-poppins font-bold text-xl text-[#4D4732]">Revenue Trend</h2>
						<select
							value={revenueYear}
							onChange={e => setRevenueYear(Number(e.target.value))}
							className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-poppins font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20">
							<option value={new Date().getFullYear()}>
								Current Year ({new Date().getFullYear()})
							</option>
							<option value={new Date().getFullYear() - 1}>
								Last Year ({new Date().getFullYear() - 1})
							</option>
						</select>
					</div>

					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={revenueTrendData}
								margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
								<XAxis
									dataKey="month"
									axisLine={false}
									tickLine={false}
									tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'Poppins', fontWeight: 600 }}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'Poppins', fontWeight: 600 }}
									tickFormatter={value => `Rp ${value / 1000000}M`}
								/>
								<Tooltip
									formatter={value => [formatRupiah(value), 'Revenue']}
									contentStyle={{
										backgroundColor: '#fff',
										border: '1px solid #F3F4F6',
										borderRadius: '12px',
										fontFamily: 'Poppins',
										fontSize: '12px',
										boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
									}}
								/>
								<Line
									type="monotone"
									dataKey="revenue"
									stroke="#F9E485"
									strokeWidth={4}
									dot={{ r: 6, fill: '#705D00', strokeWidth: 0 }}
									activeDot={{ r: 8, fill: '#705D00' }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Right: Booking Share (Donut Chart) */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
					<h2 className="font-poppins font-bold text-xl text-[#4D4732]">Booking Share</h2>

					<div className="relative h-[200px] flex items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={bookingShareData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									paddingAngle={8}
									dataKey="value">
									{bookingShareData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
						{/* Center Text */}
						<div className="absolute flex flex-col items-center justify-center">
							<span className="font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wider">
								Total
							</span>
							<span className="font-poppins font-bold text-2xl text-[#4D4732]">
								{totalCompletedBookings || 184}
							</span>
						</div>
					</div>

					{/* Legend */}
					<div className="flex flex-col gap-3 mt-2">
						{bookingShareData.map((item, index) => (
							<div key={index} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div
										className="w-3 h-3 rounded-full"
										style={{ backgroundColor: item.color }}></div>
									<span className="font-poppins font-bold text-sm text-gray-600">{item.name}</span>
								</div>
								<span className="font-poppins font-bold text-sm text-[#4D4732]">{item.value}%</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Bottom Section (Peak Booking Hours & Top Performing Packages) */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left: Peak Booking Hours */}
				<div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm flex flex-col justify-between gap-6">
					<div>
						<h2 className="font-poppins font-bold text-xl text-[#4D4732]">Peak Booking Hours</h2>
						<p className="font-inter text-xs text-gray-400 mt-1">
							Most active booking times throughout the day.
						</p>
					</div>

					{/* Simple Bar Chart representation for Peak Hours */}
					<div className="flex items-end justify-between h-[120px] px-2 border-b border-gray-100 pb-2">
						{peakHoursData.map((item, index) => {
							const maxCount = Math.max(...peakHoursData.map(h => h.count), 1);
							const heightPercent = (item.count / maxCount) * 100;
							const isPeak = item.count === maxCount;
							return (
								<div key={index} className="flex flex-col items-center gap-2 flex-1">
									<div
										className={`w-6 rounded-t-lg transition-all duration-500 ${
											isPeak ? 'bg-[#705D00]' : 'bg-[#F9E485]/60 hover:bg-[#F9E485]'
										}`}
										style={{ height: `${heightPercent}px` }}></div>
									<span className="font-inter text-[9px] font-bold text-gray-400">{item.hour}</span>
								</div>
							);
						})}
					</div>

					<div className="bg-amber-50/40 border border-amber-100/50 rounded-2xl p-4">
						<p className="font-inter text-xs text-[#705D00] leading-relaxed italic">
							<strong>Tip:</strong> Most sessions occur between 2PM - 4PM. Consider dynamic pricing
							for these hours.
						</p>
					</div>
				</div>

				{/* Right: Top Performing Packages */}
				<div className="lg:col-span-2 bg-white border border-gray-100 rounded-[24px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
					<div className="flex justify-between items-center">
						<h2 className="font-poppins font-bold text-xl text-[#4D4732]">
							Top Performing Packages
						</h2>
						<button className="font-poppins font-bold text-xs text-[#705D00] hover:underline uppercase tracking-wider">
							View All Packages
						</button>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-gray-100">
									<th className="pb-3 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
										Package Name
									</th>
									<th className="pb-3 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
										Sales Volume
									</th>
									<th className="pb-3 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider">
										Revenue
									</th>
									<th className="pb-3 font-inter text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
										Growth
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{topPackagesData.map(pkg => {
									const Icon = pkg.icon;
									return (
										<tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors">
											<td className="py-4 flex items-center gap-3">
												<div className="p-2.5 rounded-xl bg-[#FAF8F0] text-[#705D00]">
													<Icon className="w-4 h-4" />
												</div>
												<span className="font-poppins font-bold text-sm text-[#4D4732]">
													{pkg.name}
												</span>
											</td>
											<td className="py-4 font-inter text-sm text-gray-500">
												<span className="font-semibold text-gray-700">{pkg.sales}</span> sessions
											</td>
											<td className="py-4 font-poppins font-bold text-sm text-[#4D4732]">
												{formatRupiah(pkg.revenue)}
											</td>
											<td className="py-4 text-right">
												<span className="inline-flex items-center gap-1 font-poppins font-bold text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
													<TrendingUp className="w-3 h-3" /> {pkg.growth}
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
