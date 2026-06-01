'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getMyBookingHistory } from '@/lib/services/bookingService';
import { cn } from '@/utils/cn';
import {
	CreditCard,
	Calendar,
	Clock,
	CheckCircle2,
	AlertCircle,
	ExternalLink,
	Search,
	ChevronDown,
} from 'lucide-react';

// SWR Fetcher
const fetcher = () =>
	getMyBookingHistory().then(res => {
		if (res.success) return res.data;
		throw new Error(res.message || 'Gagal mengambil data');
	});

export default function PaymentsClient() {
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	// Fetch booking history using SWR
	const { data: bookings, error, mutate } = useSWR('my-bookings-history', fetcher);

	// Format currency to IDR
	const formatIDR = amount => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	// Format date
	const formatDate = dateString => {
		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}).format(date);
		} catch (e) {
			return dateString;
		}
	};

	// Map backend status to 4 main display statuses
	const getDisplayStatus = status => {
		if (!status) return 'PENDING';
		const s = status.toLowerCase();
		if (s === 'completed') return 'COMPLETED';
		if (s === 'confirmed' || s === 'partial') return 'CONFIRMED';
		if (s === 'paid') return 'PAID';
		return 'PENDING'; // Default for pending, unpaid, failed, etc.
	};

	// Process bookings to extract active invoices and payment history
	// Active Invoices: bookings with status 'pending_payment' or 'confirmed' (if there's remaining payment, but let's stick to pending_payment as action required)
	const activeInvoices = bookings
		? bookings
				.filter(
					b =>
						b.payment_status === 'unpaid' ||
						b.payment_status === 'partial' ||
						b.booking_status === 'pending_payment',
				)
				.map(b => ({
					...b,
					type:
						b.payment && b.payment.length > 0
							? b.payment[0].payment_type === 'dp'
								? 'DOWN PAYMENT'
								: 'FULL PAYMENT'
							: 'DOWN PAYMENT',
				}))
		: [
				// Fallback mock data matching Figma if no real data or loading
				{
					id: 'mock-1',
					booking_code: 'INV-2024-089',
					service: { service_name: 'Pre-Wedding Outdoor Session' },
					total_amount: 2500000,
					payment_status: 'pending',
					payment_url: '#',
					due_info: 'Due in 3 days',
					type: 'DOWN PAYMENT',
				},
				{
					id: 'mock-2',
					booking_code: 'INV-2024-102',
					service: { service_name: 'Self Photo Studio' },
					total_amount: 500000,
					payment_status: 'pending',
					payment_url: '#',
					due_info: 'Due Nov 15',
					type: 'DOWN PAYMENT',
				},
			];

	// Payment History: all bookings with their payment status
	const paymentHistory = bookings
		? bookings.map(b => ({
				id: b.id,
				booking_code: b.booking_code || `INV-2024-${String(b.id).padStart(3, '0')}`,
				date: b.start_time,
				amount: b.total_amount,
				type:
					b.payment && b.payment.length > 0
						? b.payment[0].payment_type === 'dp'
							? 'DOWN PAYMENT'
							: 'FULL PAYMENT'
						: '-',
				status: getDisplayStatus(b.payment_status), // Gunakan helper untuk memetakan status
			}))
		: [
				// Fallback mock data matching Figma
				{
					id: 'h-1',
					booking_code: 'INV-2024-075',
					date: '2024-10-12',
					amount: 3500000,
					type: 'QRIS',
					status: 'paid',
				},
				{
					id: 'h-2',
					booking_code: 'INV-2024-075',
					date: '2024-10-12',
					amount: 3500000,
					type: 'QRIS',
					status: 'paid',
				},
				{
					id: 'h-3',
					booking_code: 'INV-2024-075',
					date: '2024-10-12',
					amount: 3500000,
					type: 'QRIS',
					status: 'paid',
				},
				{
					id: 'h-4',
					booking_code: 'INV-2024-075',
					date: '2024-10-12',
					amount: 3500000,
					type: 'QRIS',
					status: 'pending',
				},
			];

	// Filter payment history based on search and status filter
	const filteredHistory = paymentHistory.filter(item => {
		const matchesSearch =
			item.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesStatus =
			statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

		return matchesSearch && matchesStatus;
	});

	return (
		<div className="w-full max-w-[1440px] mx-auto">
			{/* Header */}
			<div className="mb-10">
				<h1 className="font-poppins font-bold text-[36px] text-[#1A1C1C] leading-[46.8px] tracking-[-1%] mb-2">
					Billing & Payments
				</h1>
				<p className="font-poppins text-[18px] text-[#4D4732] leading-[28.8px]">
					Manage your session invoices, track your studio spend, and review your payment history.
				</p>
			</div>

			{/* Active Invoices Section */}
			<div className="mb-12 shadow-lg px-10 pb-5 rounded-2xl ">
				<div className="flex items-center justify-between mb-6 border-b-4 p-5">
					<h2 className="font-poppins font-semibold text-[24px] text-[#1A1C1C] leading-[33.6px]">
						Active Invoices
					</h2>
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#705E00] bg-[#FEF9C3] border border-[#FDE68A]">
						<span className="w-1.5 h-1.5 rounded-full bg-[#705E00] animate-pulse" />
						Action Required
					</span>
				</div>

				<div className="grid grid-cols-1 gap-6 overflow-y-scroll h-120">
					{activeInvoices.map(invoice => (
						<div
							key={invoice.id}
							className="bg-white/50 backdrop-blur-md rounded-[15px] border-2 border-[#F1EFE9] p-6 flex flex-col justify-between min-h-[180px] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
							<div className="flex justify-between items-start gap-4">
								<div className="space-y-2">
									<span
										className={cn(
											'inline-block text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase',
											invoice.type === 'FULL PAYMENT'
												? 'text-[#15803D] bg-[#DCFCE7]'
												: 'text-[#70621F] bg-[#F3E08F]',
										)}>
										{invoice.type || 'DOWN PAYMENT'}
									</span>
									<h3 className="font-poppins font-semibold text-[16px] text-[#1A1C1C] leading-snug">
										{invoice.service?.service_name}
									</h3>
									<p className="font-poppins text-[14px] text-[#4D4732]">
										{invoice.booking_code} • {invoice.due_info || 'Due soon'}
									</p>
								</div>

								<div className="text-right">
									<p className="font-poppins font-bold text-[20px] text-[#1A1C1C]">
										{formatIDR(invoice.total_amount)}
									</p>
								</div>
							</div>

							<div className="flex items-center justify-end gap-3 mt-6 pt-1 border-t border-[#F1EEE6]">
								<button className="px-4 py-2 text-[14px] font-bold text-[#705D00] hover:bg-black/5 rounded-xl transition-all">
									View Details
								</button>
								{invoice.payment_url && invoice.payment_url !== '#' ? (
									<a
										href={invoice.payment_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#705D00] hover:bg-[#5c4d00] rounded-xl transition-all shadow-sm">
										Pay Now
										<ExternalLink className="w-4 h-4" />
									</a>
								) : (
									<button className="px-5 py-2 text-sm font-bold text-white bg-[#705D00] hover:bg-[#5c4d00] rounded-xl transition-all shadow-sm">
										Pay Now
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Payment History Section */}
			<div className="bg-white rounded-2xl border border-[#F1EEE6] p-6 shadow-sm">
				<div className="mb-6">
					<h2 className="font-poppins font-semibold text-[24px] text-[#1A1C1C] leading-[33.6px] mb-1">
						Payment History
					</h2>
					<p className="font-poppins text-sm text-[#4D4732]">
						A complete record of your transactions with Teras Foto Studio.
					</p>
				</div>

				{/* Search & Filter Controls */}
				<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
					<div className="relative w-full sm:w-[350px]">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search className="w-4 h-4 text-[#7E775F]" />
						</div>
						<input
							type="text"
							placeholder="Search invoice ID..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl font-poppins text-sm text-[#1A1C1C] placeholder-[#9CA3AF] focus:outline-none focus:border-[#705D00] focus:ring-1 focus:ring-[#705D00] transition-all shadow-sm"
						/>
					</div>
					<div className="relative w-full sm:w-[180px]">
						<select
							value={statusFilter}
							onChange={e => setStatusFilter(e.target.value)}
							className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-xl font-poppins text-sm text-[#1A1C1C] appearance-none focus:outline-none focus:border-[#705D00] focus:ring-1 focus:ring-[#705D00] transition-all cursor-pointer shadow-sm">
							<option value="all">All Status</option>
							<option value="paid">Paid</option>
							<option value="pending">Pending</option>
							<option value="failed">Failed</option>
						</select>
						<div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
							<ChevronDown className="w-4 h-4 text-[#7E775F]" />
						</div>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-[#F1EEE6]">
								<th className="pb-4 font-poppins font-semibold text-[12px] tracking-[0.05em] text-[#4D4732] uppercase">
									Invoice ID
								</th>
								<th className="pb-4 font-poppins font-semibold text-[12px] tracking-[0.05em] text-[#4D4732] uppercase">
									Date
								</th>
								<th className="pb-4 font-poppins font-semibold text-[12px] tracking-[0.05em] text-[#4D4732] uppercase">
									Amount
								</th>
								<th className="pb-4 font-poppins font-semibold text-[12px] tracking-[0.05em] text-[#4D4732] uppercase">
									Method
								</th>
								<th className="pb-4 font-poppins font-semibold text-[12px] tracking-[0.05em] text-[#4D4732] uppercase">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#F1EEE6]/50">
							{filteredHistory.length > 0 ? (
								filteredHistory.map(item => (
									<tr key={item.id} className="hover:bg-black/[0.01] transition-colors">
										<td className="py-4 font-poppins font-semibold text-[16px] text-[#705D00] uppercase">
											{item.booking_code}
										</td>
										<td className="py-4 font-poppins text-[16px] text-[#4D4732] uppercase">
											{formatDate(item.date)}
										</td>
										<td className="py-4 font-poppins text-[16px] text-[#1A1C1C] uppercase">
											{formatIDR(item.amount)}
										</td>
										<td className="py-4 font-poppins text-[14px] text-[#1A1C1C] uppercase">
											{item.type}
										</td>
										<td className="py-4">
											<span
												className={cn(
													'inline-flex items-center px-3 py-1 rounded-[13.5px] text-[12px] font-bold uppercase',
													item.status === 'COMPLETED' && 'bg-[#DCFCE7] text-[#15803D]',
													item.status === 'CONFIRMED' && 'bg-[#DBEAFE] text-[#1D4ED8]',
													item.status === 'PAID' && 'bg-[#FEF9C3] text-[#15803D]',
													item.status === 'PENDING' && 'bg-[#FFEDD5] text-[#C2410C]',
												)}>
												{item.status}
											</span>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="5" className="py-8 text-center font-poppins text-sm text-[#7E775F]">
										No transactions found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
