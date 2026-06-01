'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Clock, User, Package, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const fetcher = url => api.get(url).then(res => res.data);

export default function ReschedulesPage() {
	const { data: reschedules, error, isLoading, mutate } = useSWR('/cashier/reschedules', fetcher);
	const [processingId, setProcessingId] = useState(null);

	const handleReview = async (rescheduleId, action) => {
		if (
			!confirm(
				`Apakah Anda yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pengajuan ini?`,
			)
		) {
			return;
		}

		setProcessingId(rescheduleId);
		try {
			await api.put(`/cashier/reschedules/${rescheduleId}/review`, { action });
			mutate(); // Refresh data
		} catch (error) {
			console.error('Failed to review reschedule:', error);
			alert(error.response?.data?.message || 'Gagal memproses pengajuan reschedule');
		} finally {
			setProcessingId(null);
		}
	};

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Persetujuan Reschedule</h1>
				<p className="text-gray-500 mt-1">Kelola pengajuan perubahan jadwal dari pelanggan</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
				</div>
			) : error ? (
				<div className="bg-red-50 text-red-600 p-4 rounded-lg">
					Gagal memuat data pengajuan reschedule. Silakan coba lagi.
				</div>
			) : !reschedules || reschedules.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-xl border border-gray-200">
					<Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900">Tidak ada pengajuan</h3>
					<p className="text-gray-500">
						Saat ini tidak ada pengajuan reschedule yang perlu diproses.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{reschedules.map(request => (
						<RescheduleCard
							key={request.id}
							request={request}
							onReview={handleReview}
							isProcessing={processingId === request.id}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function RescheduleCard({ request, onReview, isProcessing }) {
	const { booking } = request;
	const oldStartTime = parseISO(booking.start_time);
	const oldEndTime = parseISO(booking.end_time);
	const newStartTime = parseISO(request.proposed_start_time);
	const newEndTime = parseISO(request.proposed_end_time);

	return (
		<div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
			<div className="flex justify-between items-start mb-4">
				<div>
					<span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-2">
						Menunggu Persetujuan
					</span>
					<h3 className="font-semibold text-gray-900">{booking.booking_code}</h3>
				</div>
				<div className="text-right text-sm text-gray-500">
					{format(parseISO(request.created_at), 'dd MMM yyyy', { locale: id })}
				</div>
			</div>

			<div className="space-y-3 mb-6 flex-1">
				<div className="flex items-center gap-2 text-gray-700">
					<User className="w-4 h-4 text-gray-400" />
					<span className="font-medium">{booking.user?.full_name || 'Unknown User'}</span>
				</div>
				<div className="flex items-center gap-2 text-gray-600 text-sm">
					<Package className="w-4 h-4 text-gray-400" />
					<span>
						{booking.service?.service_name} ({booking.service?.room?.room_name})
					</span>
				</div>

				<div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
					<div className="mb-3">
						<p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
							Jadwal Lama
						</p>
						<div className="flex items-center gap-2 text-gray-600 text-sm line-through">
							<Clock className="w-4 h-4" />
							<span>
								{format(oldStartTime, 'dd MMM yyyy, HH:mm', { locale: id })} -{' '}
								{format(oldEndTime, 'HH:mm')}
							</span>
						</div>
					</div>

					<div className="flex justify-center my-2">
						<ArrowRight className="w-4 h-4 text-gray-400" />
					</div>

					<div>
						<p className="text-xs font-medium text-primary-600 mb-1 uppercase tracking-wider">
							Jadwal Baru
						</p>
						<div className="flex items-center gap-2 text-primary-700 text-sm font-medium">
							<Clock className="w-4 h-4" />
							<span>
								{format(newStartTime, 'dd MMM yyyy, HH:mm', { locale: id })} -{' '}
								{format(newEndTime, 'HH:mm')}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-4">
					<p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
						Alasan Customer
					</p>
					<p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg italic">
						&quot;{request.customer_reason}&quot;
					</p>
				</div>
			</div>

			<div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
				<button
					onClick={() => onReview(request.id, 'reject')}
					disabled={isProcessing}
					className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50">
					<XCircle className="w-4 h-4" />
					Tolak
				</button>
				<button
					onClick={() => onReview(request.id, 'approve')}
					disabled={isProcessing}
					className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50">
					<CheckCircle className="w-4 h-4" />
					Setujui
				</button>
			</div>
		</div>
	);
}
