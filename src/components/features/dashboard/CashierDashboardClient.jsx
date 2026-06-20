'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import {
	Calendar as CalendarIcon,
	Clock,
	User,
	Package,
	CheckCircle,
	Printer,
	Plus,
	X,
	DollarSign,
	AlertCircle,
	Trash2,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const fetcher = url => api.get(url).then(res => res.data);

const START_HOUR = 9;
const END_HOUR = 21;
const PX_PER_HOUR = 80; // 1 Jam = 80px tinggi baris untuk visualisasi lapang dan nyaman dibaca
const HOURS_TOTAL = END_HOUR - START_HOUR;

// Fungsi pembantu: Konversi ISO Date String menjadi pecahan jam (misal 10:30 -> 10.5)
const getFractionalHour = dateStr => {
	const d = new Date(dateStr);
	return d.getHours() + d.getMinutes() / 60;
};

// Fungsi pembantu: Konversi pecahan jam kembali ke string format HH:MM
const formatFractionalHour = h => {
	const hh = Math.floor(h);
	const mm = Math.round((h - hh) * 60);
	return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

// Kalkulasi posisi top absolut berdasarkan jam
const toTop = hour => {
	return (hour - START_HOUR) * PX_PER_HOUR;
};

// Kalkulasi tinggi absolut berdasarkan selisih jam
const toHeight = (start, end) => {
	return (end - start) * PX_PER_HOUR;
};

// Logika dinamis untuk mencari celah kosong (Idle Time)
const getIdleGaps = roomBookings => {
	// Ambil waktu mulai & selesai untuk semua booking, urutkan berdasarkan waktu mulai
	const parsed = roomBookings
		.map(b => ({
			start: getFractionalHour(b.start_time),
			end: getFractionalHour(b.end_time),
		}))
		.sort((a, b) => a.start - b.start);

	let prev = START_HOUR;
	const gaps = [];

	for (const b of parsed) {
		// Jika ada jeda lebih dari 5 menit (0.08 jam)
		if (b.start > prev + 0.08) {
			gaps.push({ start: prev, end: b.start });
		}
		prev = Math.max(prev, b.end);
	}

	// Jeda terakhir setelah booking terakhir s.d jam operasional tutup
	if (prev < END_HOUR - 0.08) {
		gaps.push({ start: prev, end: END_HOUR });
	}

	return gaps;
};

// Fungsi pembantu untuk menerjemahkan status booking dan payment ke label/warna terpadu
const getDisplayStatus = (bookingStatus, paymentStatus) => {
	if (bookingStatus === 'completed') {
		return {
			label: 'Selesai',
			colorClass: 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100',
			leftBorderClass: 'border-l-[4px] border-l-gray-500',
		};
	}
	if (bookingStatus === 'arrived') {
		return {
			label: 'Hadir',
			colorClass: 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100',
			leftBorderClass: 'border-l-[4px] border-l-purple-500',
		};
	}
	if (bookingStatus === 'pending_payment') {
		return {
			label: 'Menunggu Pembayaran',
			colorClass: 'bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100',
			leftBorderClass: 'border-l-[4px] border-l-yellow-500',
		};
	}
	if (bookingStatus === 'confirmed') {
		if (paymentStatus === 'partial') {
			return {
				label: 'DP Dibayar',
				colorClass: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100',
				leftBorderClass: 'border-l-[4px] border-l-blue-500',
			};
		}
		if (paymentStatus === 'paid') {
			return {
				label: 'Lunas (Confirmed)',
				colorClass: 'bg-green-50 text-green-800 border-green-300 hover:bg-green-100',
				leftBorderClass: 'border-l-[4px] border-l-green-500',
			};
		}
	}
	// Fallback jika ada status lain
	return {
		label: bookingStatus,
		colorClass: 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100',
		leftBorderClass: 'border-l-[4px] border-l-gray-400',
	};
};

export default function CashierDashboardClient({ initialDate, initialBookings }) {
	const [selectedDate, setSelectedDate] = useState(initialDate);
	const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);
	const [selectedBookingId, setSelectedBookingId] = useState(null);
	const [activeDetailBooking, setActiveDetailBooking] = useState(null);
	const [currentTime, setCurrentTime] = useState(new Date());

	// Update waktu saat ini setiap menit untuk menggeser garis penunjuk "Sekarang" secara real-time
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	const {
		data: bookings,
		error,
		isLoading,
		mutate,
	} = useSWR(`/cashier/schedule?date=${selectedDate}`, fetcher, {
		fallbackData: initialBookings,
		refreshInterval: 10000, // Polling otomatis setiap 10 detik secara senyap
	});

	const handleStatusUpdate = async (bookingId, newStatus) => {
		try {
			await api.put(`/cashier/bookings/${bookingId}/status`, {
				booking_status: newStatus,
			});
			mutate(); // Refresh data SWR
			if (activeDetailBooking && activeDetailBooking.id === bookingId) {
				setActiveDetailBooking(prev => ({ ...prev, booking_status: newStatus }));
			}
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
				if (activeDetailBooking && activeDetailBooking.id === bookingId) {
					setActiveDetailBooking(prev => ({ ...prev, booking_status: 'confirmed' }));
				}
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

	// Group bookings berdasarkan nama ruangan
	const groupedBookings =
		bookings?.reduce((acc, booking) => {
			const roomName = booking.service?.room?.room_name || 'Unknown Room';
			if (!acc[roomName]) {
				acc[roomName] = [];
			}
			acc[roomName].push(booking);
			return acc;
		}, {}) || {};

	// Cek apakah tanggal yang dipilih adalah hari ini untuk memunculkan garis "Sekarang"
	const isTodaySelected = selectedDate === format(currentTime, 'yyyy-MM-dd');
	const currentHourFraction = currentTime.getHours() + currentTime.getMinutes() / 60;
	const showNowLine =
		isTodaySelected && currentHourFraction >= START_HOUR && currentHourFraction <= END_HOUR;

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			{/* Header Dashboard */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 tracking-tight">Master Schedule Board</h1>
					<p className="text-gray-500 mt-1">Pantau utilisasi ruangan paralel secara real-time</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="date"
							value={selectedDate}
							onChange={e => setSelectedDate(e.target.value)}
							className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-medium text-gray-700"
						/>
					</div>
				</div>
			</div>

			{/* Legenda Indikator Warna */}
			<div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
					<span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 inline-block" />
					<span>Menunggu Pembayaran</span>
				</div>
				<div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
					<span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-block" />
					<span>DP Dibayar</span>
				</div>
				<div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
					<span className="w-3 h-3 rounded bg-green-100 border border-green-300 inline-block" />
					<span>Lunas</span>
				</div>
				<div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
					<span className="w-3 h-3 rounded bg-purple-100 border border-purple-300 inline-block" />
					<span>Hadir (Arrived)</span>
				</div>
				<div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
					<span className="w-3 h-3 rounded bg-gray-100 border border-gray-300 inline-block" />
					<span>Selesai (Completed)</span>
				</div>
				<div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
					<span
						style={{
							background:
								'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(156,163,175,0.15) 2px, rgba(156,163,175,0.15) 4px)',
						}}
						className="w-5 h-3 rounded border border-dashed border-gray-300 inline-block"
					/>
					<span>Idle (Kosong)</span>
				</div>
				{showNowLine && (
					<div className="flex items-center gap-2 text-xs font-semibold text-red-600 ml-auto animate-pulse">
						<span className="w-3 h-0.5 bg-red-500 inline-block relative top-[-1px]">
							<span className="absolute -left-[3px] -top-[3px] w-2 h-2 bg-red-500 rounded-full" />
						</span>
						<span>Waktu Sekarang ({formatFractionalHour(currentHourFraction)})</span>
					</div>
				)}
			</div>

			{isLoading && !bookings ? (
				<div className="flex justify-center items-center h-96">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
				</div>
			) : error && !bookings ? (
				<div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-3">
					<AlertCircle className="w-5 h-5 shrink-0" />
					<span className="font-medium">
						Gagal memuat jadwal operasional. Silakan periksa jaringan Anda.
					</span>
				</div>
			) : Object.keys(groupedBookings).length === 0 ? (
				<div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
					<CalendarIcon className="w-14 h-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-bold text-gray-900">Sistem Kosong</h3>
					<p className="text-gray-500 mt-1">
						Belum ada aktivitas transaksi atau booking terdaftar di tanggal ini.
					</p>
				</div>
			) : (
				/* Wadah Scrollable Utama (Menampung Sumbu Waktu + Semua Kolom Ruangan) */
				<div className="flex gap-0 overflow-x-auto pb-4 relative rounded-xl border border-gray-200 shadow-sm bg-white">
					{/* KOLOM 1: STICKY TIME SIDEBAR (Penunjuk Jam Operasional 09:00 - 21:00) */}
					<div className="sticky left-0 z-20 bg-white flex-none w-20 flex flex-col border-r border-gray-200 select-none">
						{/* Placeholder Header agar ketinggiannya sinkron dengan Header Ruangan */}
						<div className="h-16 bg-gray-50 border-b border-gray-200" />

						{/* Sumbu Waktu Vertikal dengan Tinggi Fix (12 Jam x 80px = 960px total tinggi) */}
						<div className="relative bg-white h-[960px]">
							{Array.from({ length: HOURS_TOTAL + 1 }).map((_, i) => {
								const hour = START_HOUR + i;
								const isLast = i === HOURS_TOTAL;
								return (
									<div
										key={hour}
										style={{
											position: 'absolute',
											top: `${i * PX_PER_HOUR}px`,
											height: isLast ? '0px' : `${PX_PER_HOUR}px`,
										}}
										className="w-full text-right pr-4 border-b border-gray-100 last:border-b-0">
										<span className="relative top-[-9px] text-[11px] font-bold text-gray-400">
											{String(hour).padStart(2, '0')}:00
										</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* KOLOM 2...N: RUANGAN-RUANGAN FISIK (Bisa digeser horizontal di Mobile) */}
					<div className="flex flex-1 gap-6 p-4 pt-0 bg-gray-50 overflow-x-auto min-w-[700px]">
						{Object.entries(groupedBookings).map(([roomName, roomBookings]) => {
							const idleGaps = getIdleGaps(roomBookings);

							return (
								<div key={roomName} className="flex-none w-80 md:w-96 flex flex-col mt-4">
									{/* Header Kolom Ruangan dengan Tinggi Fix (64px / h-16) */}
									<div className="h-16 bg-white px-4 flex flex-col justify-center rounded-t-xl border border-gray-200 border-b-0 shadow-sm">
										<h2 className="font-bold text-gray-900 text-sm md:text-base truncate">
											{roomName}
										</h2>
										<p className="text-xs text-gray-500 font-medium">
											{roomBookings.length} Sesi Aktif
										</p>
									</div>

									{/* Container Grid Ruangan (Tinggi Mutlak: 960px) */}
									<div className="bg-white rounded-b-xl border border-gray-200 relative h-[960px] overflow-hidden shadow-sm">
										{/* Garis Grid Penunjuk Batas Jam */}
										{Array.from({ length: HOURS_TOTAL }).map((_, index) => (
											<div
												key={index}
												style={{
													position: 'absolute',
													top: `${index * PX_PER_HOUR}px`,
													height: `${PX_PER_HOUR}px`,
												}}
												className="w-full border-b border-gray-100 pointer-events-none last:border-b-0"
											/>
										))}

										{/* Render Gaps Idle (Sesi Kosong) secara Otomatis */}
										{idleGaps.map((gap, idx) => (
											<div
												key={`idle-${idx}`}
												className="border border-dashed border-gray-300 flex items-center justify-center select-none pointer-events-none"
												style={{
													position: 'absolute',
													top: `${toTop(gap.start)}px`,
													height: `${toHeight(gap.start, gap.end)}px`,
													left: '4px',
													right: '4px',
													background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(156,163,175,0.06) 4px, rgba(156,163,175,0.06) 8px)',
													border: '1px dashed border-gray-300',
													borderRadius: '8px',
												}}
											>
												{toHeight(gap.start, gap.end) > 28 && (
													<span className="text-[10px] text-gray-400 font-semibold tracking-wider">
														IDLE ({formatFractionalHour(gap.start)} - {formatFractionalHour(gap.end)})
													</span>
												)}
											</div>
										))}

										{/* Render Sesi Booking Aktif Pelanggan */}
										{roomBookings.map(booking => {
											const start = getFractionalHour(booking.start_time);
											const end = getFractionalHour(booking.end_time);
											const cardHeight = toHeight(start, end);
											const statusInfo = getDisplayStatus(booking.booking_status, booking.payment_status);

											return (
												<div
													key={booking.id}
													onClick={() => setActiveDetailBooking(booking)}
													style={{
														position: 'absolute',
														top: `${toTop(start)}px`,
														height: `${cardHeight - 2}px`,
														left: '4px',
														right: '4px',
													}}
													className={cn(
														'p-2.5 rounded-lg border flex flex-col justify-between overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all select-none z-10',
														statusInfo.colorClass,
														statusInfo.leftBorderClass,
													)}>
													<div className="min-w-0 flex flex-col h-full justify-between">
														<div>
															{/* Header Sesi: Waktu */}
															<div className="flex items-center gap-1 text-[10px] font-bold opacity-85">
																<Clock className="w-3.5 h-3.5 shrink-0" />
																<span>
																	{formatFractionalHour(start)} - {formatFractionalHour(end)}
																</span>
															</div>

															{/* Nama Pelanggan (Ukuran font fleksibel menyesuaikan tinggi kartu) */}
															<div
																className={cn(
																	'font-bold text-gray-900 truncate mt-0.5',
																	cardHeight < 40 ? 'text-[11px]' : 'text-xs',
																)}>
																{booking.user?.full_name || 'No Name'}
															</div>
														</div>

														{/* Nama Paket (Hanya tampil jika tinggi kartu >= 40px) */}
														{cardHeight >= 40 && (
															<div className="text-[10px] opacity-80 font-medium truncate flex items-center gap-0.5 mt-0.5">
																<Package className="w-3 h-3 shrink-0 text-gray-400" />
																<span className="truncate">{booking.service?.service_name}</span>
															</div>
														)}

														{/* Label Status (Hanya tampil jika tinggi kartu >= 60px) */}
														{cardHeight >= 60 && (
															<span className="text-[9px] px-1.5 py-0.5 rounded bg-white/80 border border-gray-200 font-bold self-start mt-1 truncate max-w-full">
																{statusInfo.label}
															</span>
														)}
													</div>
												</div>
											);
										})}

										{/* Garis Penunjuk Waktu Sekarang (Aktif Bergerak Setiap Menit) */}
										{showNowLine && (
											<div
												style={{
													position: 'absolute',
													top: `${toTop(currentHourFraction)}px`,
												}}
												className="left-0 right-0 h-[2px] bg-red-500 z-20 pointer-events-none">
												{/* Titik Merah Penanda */}
												<div className="absolute -left-1 -top-[4px] w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* MODAL 1: DETAIL BOOKING & PANEL AKSI KASIR */}
			{activeDetailBooking && (
				<BookingDetailModal
					booking={activeDetailBooking}
					onClose={() => setActiveDetailBooking(null)}
					onUpdateStatus={handleStatusUpdate}
					onManualPayment={handleManualPayment}
					onAddOn={openAddOnModal}
					onDeleteAddOn={async (bookingAddonId) => {
						if (window.confirm('Yakin ingin menghapus item add-on ini dari tagihan?')) {
							try {
								await api.delete(`/cashier/bookings/${activeDetailBooking.id}/add-ons/${bookingAddonId}`);
								mutate(); // Refresh data utama
								// Update state local activeDetailBooking agar UI modal langsung ter-update seketika
								setActiveDetailBooking(prev => {
									const updatedAddons = prev.bookingaddon.filter(a => a.id !== bookingAddonId);
									const removedAddon = prev.bookingaddon.find(a => a.id === bookingAddonId);
									const newTotalAmount = Number(prev.total_amount) - Number(removedAddon?.subtotal_price || 0);
									return {
										...prev,
										bookingaddon: updatedAddons,
										total_amount: newTotalAmount
									};
								});
							} catch (error) {
								console.error('Failed to delete add-on:', error);
								alert(error.response?.data?.message || 'Gagal menghapus item add-on');
							}
						}
					}}
				/>
			)}

			{/* MODAL 2: TAMBAH ADD-ON JADWAL */}
			{isAddOnModalOpen && (
				<AddOnModal
					bookingId={selectedBookingId}
					onClose={() => setIsAddOnModalOpen(false)}
					onSuccess={() => {
						setIsAddOnModalOpen(false);
						mutate(); // Refresh data harian
						const updated = bookings?.find(b => b.id === selectedBookingId);
						if (updated) {
							setActiveDetailBooking(updated);
						}
					}}
				/>
			)}
		</div>
	);
}

// ---------------------------------------------------------
// COMPONENT 2: BOOKING DETAIL MODAL (MODAL DETAIL INTERAKTIF KASIR)
// ---------------------------------------------------------
function BookingDetailModal({ booking, onClose, onUpdateStatus, onManualPayment, onAddOn, onDeleteAddOn }) {
	const startTime = new Date(booking.start_time);
	const endTime = new Date(booking.end_time);
	const statusInfo = getDisplayStatus(booking.booking_status, booking.payment_status);

	// Perhitungan Kasir Cerdas (Kalkulasi Tagihan & Sisa Pembayaran)
	const baseAmount = Number(booking.total_amount) - (booking.bookingaddon?.reduce((sum, item) => sum + Number(item.subtotal_price), 0) || 0);
	const totalAddonAmount = booking.bookingaddon?.reduce((sum, item) => sum + Number(item.subtotal_price), 0) || 0;
	const totalBill = Number(booking.total_amount);

	// Hitung DP terbayar (Pembayaran sukses pertama)
	const downPayment = booking.payment?.find(p => p.payment_status === 'paid' && p.payment_type === 'dp')?.amount || 0;
	// Hitung total semua pembayaran lunas
	const totalPaid = booking.payment?.filter(p => p.payment_status === 'paid')?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
	const remainingPayment = Math.max(0, totalBill - totalPaid);

	return (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4 backdrop-blur-sm">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
				{/* Modal Header */}
				<div className="p-6 bg-gray-900 text-white flex justify-between items-center">
					<div>
						<span className="text-[10px] bg-white/20 text-white font-bold px-2 py-1 rounded-full uppercase tracking-wider">
							Detail Sesi Reservasi
						</span>
						<h2 className="text-lg font-bold mt-1.5">{booking.booking_code}</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg outline-none">
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
					{/* Status Section */}
					<div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
								<Clock className="w-5 h-5 text-gray-500" />
							</div>
							<div>
								<p className="text-xs text-gray-400 font-semibold uppercase">Waktu Sesi</p>
								<p className="font-bold text-gray-800 text-sm mt-0.5">
									{startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} -{' '}
									{endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
								</p>
							</div>
						</div>
						<span
							className={cn(
								'px-3 py-1.5 rounded-full text-xs font-bold border',
								statusInfo.colorClass,
							)}>
							{statusInfo.label}
						</span>
					</div>

					{/* Customer & Service Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 rounded-xl border border-gray-200 space-y-1">
							<div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase">
								<User className="w-4 h-4" />
								<span>Identitas Pelanggan</span>
							</div>
							<p className="font-bold text-gray-900 mt-1">{booking.user?.full_name || 'Unknown'}</p>
							<p className="text-xs text-gray-500 font-medium">
								{booking.user?.email || 'No email'}
							</p>
						</div>

						<div className="p-4 rounded-xl border border-gray-200 space-y-1">
							<div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase">
								<Package className="w-4 h-4" />
								<span>Layanan / Paket</span>
							</div>
							<p className="font-bold text-gray-900 mt-1">
								{booking.service?.service_name || 'Unknown'}
							</p>
							<p className="text-xs text-gray-500 font-medium">
								Harga: Rp {Number(baseAmount).toLocaleString('id-ID')}
							</p>
						</div>
					</div>

					{/* List Add-Ons */}
					<div className="space-y-2">
						<h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
							Daftar Item Add-ons Tambahan
						</h3>
						{booking.bookingaddon?.length > 0 ? (
							<div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
								<ul className="divide-y divide-gray-200">
									{booking.bookingaddon.map(addon => (
										<li key={addon.id} className="py-2.5 flex justify-between items-center text-sm font-medium">
											<div className="flex flex-col">
												<span className="text-gray-700 font-bold">{addon.addon?.add_on_name} (x{addon.quantity})</span>
												<span className="text-xs text-gray-400">Rp {Number(addon.subtotal_price).toLocaleString('id-ID')}</span>
											</div>
											<button
												onClick={() => onDeleteAddOn(addon.id)}
												title="Hapus Add-on"
												className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors outline-none border border-transparent hover:border-red-100">
												<Trash2 className="w-4.5 h-4.5" />
											</button>
										</li>
									))}
								</ul>
							</div>
						) : (
							<p className="text-sm text-gray-400 italic">
								Belum ada add-on terdaftar pada sesi ini.
							</p>
						)}
					</div>

					{/* Rincian Struk Pembayaran Cerdas (Struk Detail Checkout) */}
					<div className="p-4 bg-gray-900 text-white rounded-xl shadow-inner space-y-3 font-mono text-xs">
						<div className="border-b border-dashed border-gray-700 pb-2">
							<p className="text-center font-bold text-gray-400 tracking-wider">STRUK CHECKOUT BELANJA</p>
						</div>
						
						<div className="space-y-1.5">
							<div className="flex justify-between">
								<span>PAKET UTAMA ({booking.service?.service_name || 'Service'})</span>
								<span>Rp {Number(baseAmount).toLocaleString('id-ID')}</span>
							</div>
							
							{booking.bookingaddon?.length > 0 && (
								<div className="flex justify-between text-gray-400">
									<span>TOTAL BELANJA ADD-ON</span>
									<span>Rp {Number(totalAddonAmount).toLocaleString('id-ID')}</span>
								</div>
							)}
						</div>

						<div className="border-t border-dashed border-gray-700 pt-2 flex justify-between font-bold text-sm text-yellow-400">
							<span>TOTAL TAGIHAN (NET)</span>
							<span>Rp {Number(totalBill).toLocaleString('id-ID')}</span>
						</div>

						<div className="space-y-1 text-gray-400 border-t border-dashed border-gray-700 pt-2">
							<div className="flex justify-between">
								<span>DP DIBAYAR (MIDTRANS)</span>
								<span>- Rp {Number(downPayment).toLocaleString('id-ID')}</span>
							</div>
							{totalPaid - downPayment > 0 && (
								<div className="flex justify-between">
									<span>ANGSURAN CASH KASIR</span>
									<span>- Rp {Number(totalPaid - downPayment).toLocaleString('id-ID')}</span>
								</div>
							)}
						</div>

						<div className="border-t-[3px] border-double border-gray-700 pt-2 flex justify-between font-bold text-base text-green-400">
							<span>SISA PELUNASAN</span>
							<span>Rp {Number(remainingPayment).toLocaleString('id-ID')}</span>
						</div>
					</div>
				</div>

				{/* Modal Actions Footer */}
				<div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col gap-2.5">
					{/* Tombol Terima Bayar Manual (Cash) - Hanya muncul jika masih ada sisa tagihan */}
					{remainingPayment > 0 ? (
						<button
							onClick={() => onManualPayment(booking.id)}
							className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 active:scale-[0.99] transition-all text-sm font-bold shadow-sm">
							<DollarSign className="w-4 h-4" />
							Terima Pembayaran Tunai (Rp {remainingPayment.toLocaleString('id-ID')})
						</button>
					) : (
						<button
							disabled
							onClick={() => alert('Pembayaran sudah diterima dan tagihan telah lunas sepenuhnya!')}
							className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed text-sm font-bold shadow-sm">
							<DollarSign className="w-4 h-4 text-gray-300" />
							Pembayaran Sudah Diterima (Lunas)
						</button>
					)}

					{/* Tombol Set Kedatangan - Hanya muncul jika belum tiba */}
					{(booking.booking_status === 'confirmed' || booking.booking_status === 'partial') && (
						<button
							onClick={() => onUpdateStatus(booking.id, 'arrived')}
							className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-[0.99] transition-all text-sm font-bold shadow-sm">
							<CheckCircle className="w-4 h-4" />
							Konfirmasi Kehadiran Pelanggan (Set Hadir)
						</button>
					)}

					{/* Tombol Selesai & Kirim ke Antrean Cetak - Hanya boleh di-klik jika sudah arrived DAN sudah lunas sepenuhnya */}
					{booking.booking_status === 'arrived' && (
						<button
							onClick={() => {
								if (remainingPayment > 0) {
									alert(`Sesi foto belum bisa diselesaikan! Pelanggan masih memiliki sisa kekurangan pembayaran sebesar Rp ${remainingPayment.toLocaleString('id-ID')}. Tolong lakukan pelunasan terlebih dahulu.`);
									return;
								}
								onUpdateStatus(booking.id, 'completed');
							}}
							disabled={remainingPayment > 0}
							className={cn(
								"w-full flex items-center justify-center gap-2 py-3 rounded-lg active:scale-[0.99] transition-all text-sm font-bold shadow-sm",
								remainingPayment > 0 
									? "bg-gray-300 text-gray-500 cursor-not-allowed" 
									: "bg-green-600 text-white hover:bg-green-700"
							)}>
							<Printer className="w-4 h-4" />
							Sesi Selesai (Kirim ke Antrean Cetak)
						</button>
					)}

					{/* Tombol Tambah Add-On */}
					{(booking.booking_status === 'arrived' ||
						booking.booking_status === 'confirmed' ||
						booking.booking_status === 'partial') && (
						<button
							onClick={() => onAddOn(booking.id)}
							className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 active:scale-[0.99] transition-all text-sm font-bold shadow-sm">
							<Plus className="w-4 h-4 text-gray-500" />
							Tambah Pembelian Add-on Baru
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------
// COMPONENT 3: ADD-ON MODAL
// ---------------------------------------------------------
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
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
				<div className="p-6 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">Tambah Add-on</h2>
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
								<label className="block text-sm font-semibold text-gray-700 mb-1">
									Pilih Add-on
								</label>
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
								<label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah</label>
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
							className="px-4 py-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
							{isSubmitting ? 'Menyimpan...' : 'Simpan'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
