'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { X } from 'lucide-react';

// Validation Schema
const rescheduleSchema = z.object({
	selectedDate: z.string().min(1, 'Tanggal wajib dipilih'),
	selectedTime: z.string().min(1, 'Jam wajib dipilih'),
	reason: z.string().min(10, 'Alasan minimal 10 karakter').max(500, 'Alasan maksimal 500 karakter'),
});

export default function RescheduleModal({ booking, onClose, onSuccess }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(rescheduleSchema),
		defaultValues: {
			selectedDate: '',
			selectedTime: '',
			reason: '',
		},
	});

	// Close modal on Escape key press
	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	// Generate 14 days from tomorrow for reschedule date selection
	const generateAvailableDates = () => {
		const dates = [];
		const tomorrow = addDays(startOfDay(new Date()), 1);
		for (let i = 0; i < 14; i++) {
			dates.push(addDays(tomorrow, i));
		}
		return dates;
	};

	const availableDates = generateAvailableDates();

	// Standard operational hours (09:00 - 20:00)
	const availableTimes = [
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
		'18:00',
		'19:00',
		'20:00',
	];

	const onSubmit = async data => {
		setIsLoading(true);
		setError(null);

		try {
			// Combine date and time into ISO string
			const [hours, minutes] = data.selectedTime.split(':');
			const proposedDate = new Date(data.selectedDate);
			proposedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
			const proposedStartTimeISO = proposedDate.toISOString();

			const response = await api.post(`/bookings/${booking.id}/reschedule`, {
				proposed_start_time: proposedStartTimeISO,
				customer_reason: data.reason,
			});

			if (response.success) {
				onSuccess();
				onClose();
			} else {
				throw new Error(response.message || 'Gagal mengajukan reschedule');
			}
		} catch (err) {
			console.error('Reschedule error:', err);
			setError(err.message || 'Terjadi kesalahan saat mengajukan reschedule.');
		} finally {
			setIsLoading(false);
		}
	};

	const selectedDateField = register('selectedDate');
	const selectedTimeField = register('selectedTime');
	const reasonField = register('reason');

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="reschedule-modal-title">
			{/* Modal Container */}
			<div className="w-full max-w-lg bg-white rounded-[30px] border border-[#F1EEE6] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-[#F1EEE6]">
					<h2 id="reschedule-modal-title" className="font-poppins font-bold text-lg text-[#1C1B1B]">
						Ajukan Reschedule
					</h2>
					<button
						onClick={onClose}
						className="p-1.5 text-[#8C8370] hover:text-[#1C1B1B] hover:bg-slate-50 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]"
						aria-label="Tutup modal">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
					{error && (
						<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-poppins">
							{error}
						</div>
					)}

					<div className="space-y-1.5">
						<label
							htmlFor="reschedule-date"
							className="block font-poppins text-xs font-semibold text-[#4E4633]">
							PILIH TANGGAL BARU
						</label>
						<select
							id="reschedule-date"
							name={selectedDateField.name}
							onChange={selectedDateField.onChange}
							onBlur={selectedDateField.onBlur}
							ref={selectedDateField.ref}
							className={`w-full px-4 py-3 font-poppins text-sm text-[#1C1B1B] bg-white border ${
								errors.selectedDate ? 'border-red-500' : 'border-[#F1EEE6]'
							} rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFD701] focus:border-transparent transition-all`}
							aria-invalid={errors.selectedDate ? 'true' : 'false'}>
							<option value="">-- Pilih Tanggal --</option>
							{availableDates.map(date => (
								<option key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
									{format(date, 'EEEE, d MMMM yyyy')}
								</option>
							))}
						</select>
						{errors.selectedDate && (
							<p className="text-xs text-red-500 font-poppins mt-1">
								{errors.selectedDate.message}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label
							htmlFor="reschedule-time"
							className="block font-poppins text-xs font-semibold text-[#4E4633]">
							PILIH JAM BARU
						</label>
						<select
							id="reschedule-time"
							name={selectedTimeField.name}
							onChange={selectedTimeField.onChange}
							onBlur={selectedTimeField.onBlur}
							ref={selectedTimeField.ref}
							className={`w-full px-4 py-3 font-poppins text-sm text-[#1C1B1B] bg-white border ${
								errors.selectedTime ? 'border-red-500' : 'border-[#F1EEE6]'
							} rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFD701] focus:border-transparent transition-all`}
							aria-invalid={errors.selectedTime ? 'true' : 'false'}>
							<option value="">-- Pilih Jam --</option>
							{availableTimes.map(time => (
								<option key={time} value={time}>
									{time} WIB
								</option>
							))}
						</select>
						{errors.selectedTime && (
							<p className="text-xs text-red-500 font-poppins mt-1">
								{errors.selectedTime.message}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label
							htmlFor="reschedule-reason"
							className="block font-poppins text-xs font-semibold text-[#4E4633]">
							ALASAN RESCHEDULE
						</label>
						<textarea
							id="reschedule-reason"
							rows={3}
							name={reasonField.name}
							onChange={reasonField.onChange}
							onBlur={reasonField.onBlur}
							ref={reasonField.ref}
							placeholder="Tuliskan alasan Anda mengajukan perubahan jadwal..."
							className={`w-full px-4 py-3 font-poppins text-sm text-[#1C1B1B] bg-white border ${
								errors.reason ? 'border-red-500' : 'border-[#F1EEE6]'
							} rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFD701] focus:border-transparent transition-all resize-none`}
							aria-invalid={errors.reason ? 'true' : 'false'}
						/>
						{errors.reason && (
							<p className="text-xs text-red-500 font-poppins mt-1">{errors.reason.message}</p>
						)}
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-4 border-t border-[#F1EEE6]">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="font-poppins text-sm font-semibold border border-[#F1EEE6] text-[#4E4633] hover:bg-slate-50 disabled:opacity-50 transition-all px-5 py-2.5 rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]">
							Batal
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="font-poppins text-sm font-semibold bg-[#FFD701] text-[#705D00] hover:bg-[#e6c200] disabled:opacity-50 transition-all px-5 py-2.5 rounded-[20px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00]">
							{isLoading ? 'Mengirim...' : 'Kirim Permohonan'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
