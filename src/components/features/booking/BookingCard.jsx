'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, parseISO, differenceInDays } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { api } from '@/lib/api';
import { cn } from '@/utils/cn';
import { Calendar, Clock } from 'lucide-react';

export default function BookingCard({ booking, onActionSuccess, onRescheduleClick }) {
	const [isCanceling, setIsCanceling] = useState(false);
	const [cancelError, setCancelError] = useState(null);

	const {
		id,
		booking_code,
		service,
		start_time,
		booking_status,
		payment_url,
		reschedule_count = 0,
		total_amount,
	} = booking;

	// Parse booking date
	const bookingDate = parseISO(start_time);
	const formattedDate = format(bookingDate, 'MMM dd, yyyy', { locale: localeID });

	// Format time range (assuming 2 hours duration as in design, or just start time)
	const formattedTimeStart = format(bookingDate, 'hh:mm a');
	// Let's add 2 hours for the end time to match the design's "10:00 AM - 12:00 PM" style
	const bookingEndDate = new Date(bookingDate.getTime() + 2 * 60 * 60 * 1000);
	const formattedTimeEnd = format(bookingEndDate, 'hh:mm a');
	const formattedTimeRange = `${formattedTimeStart} - ${formattedTimeEnd}`;

	// Determine current status (fallback to booking_status, status, or payment_status)
	const currentStatus = booking_status;

	// Check if reschedule is allowed:
	// 1. Status must be 'confirmed'
	// 2. Must be > 3 days away from today
	// 3. reschedule_count must be 0
	const today = new Date();
	const daysDifference = differenceInDays(bookingDate, today);
	const canReschedule =
		currentStatus === 'confirmed' && daysDifference > 3 && reschedule_count === 0;

	// Check if cancel is allowed:
	// 1. Status must be 'confirmed' or 'pending_payment'
	const canCancel = currentStatus === 'confirmed' || currentStatus === 'pending_payment';

	const handleCancel = async () => {
		const confirmMsg =
			currentStatus === 'confirmed'
				? 'Apakah Anda yakin ingin membatalkan pesanan ini? Pembayaran DP yang telah dilakukan akan HANGUS.'
				: 'Apakah Anda yakin ingin membatalkan pesanan ini?';

		if (!window.confirm(confirmMsg)) return;

		setIsCanceling(true);
		setCancelError(null);

		try {
			const response = await api.put(`/bookings/${id}/cancel`);
			if (response.success) {
				onActionSuccess();
			} else {
				throw new Error(response.message || 'Gagal membatalkan pesanan');
			}
		} catch (err) {
			console.error('Cancel error:', err);
			setCancelError(err.message || 'Terjadi kesalahan saat membatalkan pesanan.');
		} finally {
			setIsCanceling(false);
		}
	};

	// Status Badge Styles
	const getStatusBadge = () => {
		const statusMap = {
			pending_payment: 'Pending Payment',
			confirmed: 'Confirmed',
			expired: 'Expired',
			canceled: 'Canceled',
			completed: 'Completed',
			arrived: 'Arrived',
		};

		const badgeStyles = {
			pending_payment: 'text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A]',
			confirmed: 'text-[#2E7D32] bg-[#E8F5E9] border border-[#C8E6C9]',
			expired: 'text-[#9CA3AF] bg-[#F3F4F6] border border-[#E5E7EB]',
			canceled: 'text-[#C62828] bg-[#FFEBEE] border border-[#FFCDD2]',
			completed: 'text-[#1D4ED8] bg-[#DBEAFE] border border-[#BFDBFE]',
			arrived: 'text-[#047857] bg-[#D1FAE5] border border-[#A7F3D0]',
			default: 'text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB]',
		};

		const currentStyle = badgeStyles[currentStatus] || badgeStyles.default;
		const label = statusMap[currentStatus] || currentStatus;

		return (
			<span
				className={cn(
					'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
					currentStyle,
				)}>
				{currentStatus === 'confirmed' && (
					<span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
				)}
				{currentStatus === 'pending_payment' && (
					<span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
				)}
				{currentStatus === 'completed' && (
					<span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
				)}
				{currentStatus === 'canceled' && <span className="w-1.5 h-1.5 rounded-full bg-[#C62828]" />}
				{currentStatus === 'expired' && <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />}
				{currentStatus === 'arrived' && <span className="w-1.5 h-1.5 rounded-full bg-[#047857]" />}
				{label}
			</span>
		);
	};

	// Left border accent color based on status
	const getLeftBorderAccent = () => {
		switch (currentStatus) {
			case 'confirmed':
				return 'border-l-[4px] border-l-[#FFD701]';
			case 'pending_payment':
				return 'border-l-[4px] border-l-[#F59E0B]';
			case 'completed':
				return 'border-l-[4px] border-l-[#1D4ED8]';
			case 'canceled':
				return 'border-l-[4px] border-l-[#EF4444]';
			case 'expired':
				return 'border-l-[4px] border-l-[#9CA3AF]';
			case 'arrived':
				return 'border-l-[4px] border-l-[#047857]';
			default:
				return 'border-l-[4px] border-l-[#E5E7EB]';
		}
	};

	return (
		<div
			className={cn(
				'bg-white rounded-2xl border border-[#F1EEE6] p-6 flex flex-col justify-between min-h-[240px] shadow-sm hover:shadow-md transition-all duration-200',
				getLeftBorderAccent(),
			)}>
			<div className="flex flex-col gap-4">
				{/* Top Row: Category & Status */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="px-3 py-1 bg-[#FEF9C3] text-[#713F12] text-xs font-bold rounded-full uppercase tracking-wider">
							{service?.category?.category_name || 'Photography'}
						</span>
						{booking_code && (
							<span className="text-xs font-mono font-semibold text-[#7E775F] bg-[#F3F3F4] px-2 py-1 rounded-md">
								#{booking_code}
							</span>
						)}
					</div>
					{getStatusBadge()}
				</div>

				{/* Service Name */}
				<h3 className="font-poppins font-bold text-[20px] text-[#1A1C1C] leading-tight">
					{service?.service_name || 'Layanan Foto'}
				</h3>

				{/* Date & Time Row */}
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#4D4732] font-medium">
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-[#7E775F]" />
						<span>{formattedDate}</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4 text-[#7E775F]" />
						<span>{formattedTimeRange}</span>
					</div>
				</div>
			</div>

			{cancelError && (
				<p className="text-xs text-red-600 font-inter bg-red-50 p-3 rounded-xl border border-red-100 mt-3">
					{cancelError}
				</p>
			)}

			{/* Bottom Row: Actions */}
			<div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#F1EEE6]">
				{currentStatus === 'completed' || currentStatus === 'arrived' ? (
					<>
						<Link
							href="/booking"
							className="flex-1 text-center font-inter text-[14px] font-semibold border border-[#E5E7EB] text-[#4D4732] hover:bg-[#F9FAFB] transition-all py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD701]">
							Book Again
						</Link>
						<button className="flex-1 font-inter text-[14px] font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]">
							View Gallery
						</button>
					</>
				) : (
					<>
						{canCancel && (
							<button
								onClick={handleCancel}
								disabled={isCanceling}
								className="flex-1 font-inter text-[14px] font-semibold border border-[#E5E7EB] text-[#4D4732] hover:bg-[#F9FAFB] disabled:opacity-50 transition-all py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
								{isCanceling ? 'Canceling...' : 'Cancel Request'}
							</button>
						)}

						{canReschedule && (
							<button
								onClick={() => onRescheduleClick(booking)}
								className="flex-1 font-inter text-[14px] font-semibold border border-[#E5E7EB] text-[#4D4732] hover:bg-[#F9FAFB] transition-all py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD701]">
								Reschedule
							</button>
						)}

						{currentStatus === 'pending_payment' && payment_url ? (
							<a
								href={payment_url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1 text-center font-inter text-[14px] font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]">
								Pay Now
							</a>
						) : (
							<button className="flex-1 font-inter text-[14px] font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] transition-all py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]">
								View Details
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
}
