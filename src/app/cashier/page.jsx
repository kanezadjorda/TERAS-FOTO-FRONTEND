'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import {
	Calendar as CalendarIcon,
	Clock,
	User,
	Package,
	CheckCircle,
	Printer,
	Plus,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const fetcher = url => api.get(url).then(res => res.data);

export default function CashierSchedulePage() {
	const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);
	const [selectedBookingId, setSelectedBookingId] = useState(null);

	const {
		data: bookings,
		error,
		isLoading,
		mutate,
	} = useSWR(`/cashier/schedule?date=${selectedDate}`, fetcher);

	const handleStatusUpdate = async (bookingId, newStatus) => {
		try {
			await api.put(`/cashier/bookings/${bookingId}/status`, {
				booking_status: newStatus,
			});
			mutate(); // Refresh data
		} catch (error) {
			console.error('Failed to update status:', error);
			alert('Gagal memperbarui status booking');
		}
	};

	const handleManualPayment = async bookingId => {
		if (window.confirm('Yakin ingin mengkonfirmasi pembayaran ini secara manual?')) {
			try {
				await api.put(`/cashier/bookings/${bookingId}/manual-pay`);
				mutate(); // Refresh data
			} catch (error) {
				console.error('Failed to confirm manual payment:', error);
				alert(error.response?.data?.message || 'Gagal mengkonfirmasi pembayaran manual');
			}
		}
	};

	const openAddOnModal = bookingId => {
		setSelectedBookingId(bookingId);
		setIsAddOnModalOpen(true);
	};

	// Group bookings by room
	const groupedBookings =
		bookings?.reduce((acc, booking) => {
			const roomName = booking.service?.room?.room_name || 'Unknown Room';
			if (!acc[roomName]) {
				acc[roomName] = [];
			}
			acc[roomName].push(booking);
			return acc;
		}, {}) || {};

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Master Schedule Board</h1>
					<p className="text-gray-500 mt-1">Kelola jadwal harian dan kedatangan pelanggan</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="date"
							value={selectedDate}
							onChange={e => setSelectedDate(e.target.value)}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
						/>
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
				</div>
			) : error ? (
				<div className="bg-red-50 text-red-600 p-4 rounded-lg">
					Gagal memuat jadwal. Silakan coba lagi.
				</div>
			) : Object.keys(groupedBookings).length === 0 ? (
				<div className="text-center py-12 bg-white rounded-xl border border-gray-200">
					<CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900">Tidak ada jadwal</h3>
					<p className="text-gray-500">Belum ada booking untuk tanggal ini.</p>
				</div>
			) : (
				<div className="flex gap-6 overflow-x-auto pb-4">
					{Object.entries(groupedBookings).map(([roomName, roomBookings]) => (
						<div key={roomName} className="flex-none w-96 flex flex-col">
							<div className="bg-gray-100 p-4 rounded-t-xl border border-gray-200 border-b-0">
								<h2 className="font-semibold text-gray-900">{roomName}</h2>
								<p className="text-sm text-gray-500">{roomBookings.length} Sesi</p>
							</div>
							<div className="bg-gray-50 p-4 rounded-b-xl border border-gray-200 flex-1 flex flex-col gap-4 min-h-[500px]">
								{roomBookings.map(booking => (
									<BookingCard
										key={booking.id}
										booking={booking}
										onUpdateStatus={handleStatusUpdate}
										onAddOn={openAddOnModal}
										onManualPayment={handleManualPayment}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			)}

			{isAddOnModalOpen && (
				<AddOnModal
					bookingId={selectedBookingId}
					onClose={() => setIsAddOnModalOpen(false)}
					onSuccess={() => {
						setIsAddOnModalOpen(false);
						mutate();
					}}
				/>
			)}
		</div>
	);
}

function BookingCard({ booking, onUpdateStatus, onAddOn, onManualPayment }) {
	const startTime = new Date(booking.start_time);
	const endTime = new Date(booking.end_time);

	const getStatusColor = (status) => {
		switch (status) {
			case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
			case 'partial': return 'bg-blue-100 text-blue-800';
			case 'confirmed': return 'bg-green-100 text-green-800';
			case 'arrived': return 'bg-purple-100 text-purple-800';
			case 'completed': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusLabel = (status) => {
		switch (status) {
			case 'pending_payment': return 'Menunggu Pembayaran';
			case 'partial': return 'DP Dibayar';
			case 'confirmed': return 'Lunas';
			case 'arrived': return 'Hadir';
			case 'completed': return 'Selesai';
			default: return status;
		}
	};

	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start mb-3">
				<div className="flex items-center gap-2 text-primary-700 font-medium">
					<Clock className="w-4 h-4" />
					<span>
						{startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} -{' '}
						{endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
					</span>
				</div>
				<span
					className={cn(
						'px-2.5 py-1 rounded-full text-xs font-medium',
						getStatusColor(booking.booking_status),
					)}>
					{getStatusLabel(booking.booking_status)}
				</span>
			</div>

			<div className="space-y-2 mb-4">
				<div className="flex items-center gap-2 text-gray-700">
					<User className="w-4 h-4 text-gray-400" />
					<span className="font-medium">{booking.user?.full_name || 'Unknown User'}</span>
				</div>
				<div className="flex items-center gap-2 text-gray-600 text-sm">
					<Package className="w-4 h-4 text-gray-400" />
					<span>{booking.service?.service_name || 'Unknown Service'}</span>
				</div>
			</div>

			{booking.bookingaddon?.length > 0 && (
				<div className="mb-4 p-3 bg-gray-50 rounded-md">
					<p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Add-ons</p>
					<ul className="space-y-1">
						{booking.bookingaddon.map(addon => (
							<li key={addon.id} className="text-sm text-gray-700 flex justify-between">
								<span>
									{addon.addon?.add_on_name} (x{addon.quantity})
								</span>
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
				{booking.booking_status === 'pending_payment' && (
					<button
						onClick={() => onManualPayment(booking.id)}
						className="w-full flex items-center justify-center gap-2 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium">
						<CheckCircle className="w-4 h-4" />
						Terima Bayar Manual (Cash)
					</button>
				)}

				{(booking.booking_status === 'confirmed' || booking.booking_status === 'partial') && (
					<button
						onClick={() => onUpdateStatus(booking.id, 'arrived')}
						className="w-full flex items-center justify-center gap-2 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium">
						<CheckCircle className="w-4 h-4" />
						Set Hadir
					</button>
				)}

				{booking.booking_status === 'arrived' && (
					<button
						onClick={() => onUpdateStatus(booking.id, 'completed')}
						className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
						<Printer className="w-4 h-4" />
						Selesai (Masuk Antrean Cetak)
					</button>
				)}

				{(booking.booking_status === 'arrived' ||
					booking.booking_status === 'confirmed' ||
					booking.booking_status === 'partial') && (
					<button
						onClick={() => onAddOn(booking.id)}
						className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
						<Plus className="w-4 h-4" />
						Tambah Add-on
					</button>
				)}
			</div>
		</div>
	);
}

function AddOnModal({ bookingId, onClose, onSuccess }) {
	const [selectedAddOn, setSelectedAddOn] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: addOns, isLoading } = useSWR('/add-ons', fetcher);

	const handleSubmit = async e => {
		e.preventDefault();
		if (!selectedAddOn || quantity < 1) return;

		setIsSubmitting(true);
		try {
			await api.post(`/cashier/bookings/${bookingId}/add-ons`, {
				add_on_id: selectedAddOn,
				quantity: parseInt(quantity, 10),
			});
			onSuccess();
		} catch (error) {
			console.error('Failed to add add-on:', error);
			alert('Gagal menambahkan add-on');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
				<div className="p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">Tambah Add-on</h2>
					<p className="text-sm text-gray-500 mt-1">Tambahkan layanan ekstra untuk booking ini</p>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{isLoading ? (
						<div className="flex justify-center py-4">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
						</div>
					) : (
						<>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Pilih Add-on</label>
								<select
									value={selectedAddOn}
									onChange={e => setSelectedAddOn(e.target.value)}
									required
									className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
									<option value="">-- Pilih Add-on --</option>
									{addOns?.map(addon => (
										<option key={addon.id} value={addon.id}>
											{addon.add_on_name} - Rp {Number(addon.price).toLocaleString('id-ID')}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
								<input
									type="number"
									min="1"
									value={quantity}
									onChange={e => setQuantity(e.target.value)}
									required
									className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
								/>
							</div>
						</>
					)}

					<div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
							Batal
						</button>
						<button
							type="submit"
							disabled={isSubmitting || !selectedAddOn || isLoading}
							className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
							{isSubmitting ? 'Menyimpan...' : 'Simpan'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
