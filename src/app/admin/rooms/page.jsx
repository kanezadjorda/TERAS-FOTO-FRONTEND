'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getAdminRooms, deleteRoom } from '@/lib/services/roomService';
import { Plus, Trash2, Loader2, AlertCircle, DoorOpen, CheckCircle2 } from 'lucide-react';

export default function AdminRoomsPage() {
	const [deletingId, setDeletingId] = useState(null);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	// Fetch daftar ruangan dari endpoint admin baru
	const {
		data: roomsResponse,
		error: fetchError,
		isLoading,
	} = useSWR('/admin/rooms', () => getAdminRooms());

	const rooms = roomsResponse?.data || [];

	const handleDelete = async id => {
		if (!confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) return;

		setDeletingId(id);
		setError(null);
		setSuccess(null);

		try {
			await deleteRoom(id);
			setSuccess('Ruangan berhasil dihapus.');
			// Revalidate data SWR
			mutate('/admin/rooms');
		} catch (err) {
			console.error('Error deleting room:', err);
			setError(err.message || 'Gagal menghapus ruangan.');
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="font-poppins font-bold text-3xl text-[#111111] tracking-tight">
						Manajemen Ruangan Studio
					</h1>
					<p className="text-stone-500 text-sm font-inter">
						Kelola daftar ruangan studio aktif yang tersedia untuk booking pelanggan.
					</p>
				</div>
				{/* Tombol Tambah Ruangan (Bisa dihubungkan ke form tambah ruangan jika sudah ada) */}
				<button
					onClick={() => alert('Fitur tambah ruangan akan segera hadir!')}
					className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#705D00] hover:bg-[#5c4b00] text-white font-poppins font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm">
					<Plus className="w-4 h-4" />
					Tambah Ruangan
				</button>
			</div>

			{/* Success Alert */}
			{success && (
				<div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800">
					<CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
					<div>
						<p className="text-sm font-medium">{success}</p>
					</div>
				</div>
			)}

			{/* Error Alert */}
			{error && (
				<div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800">
					<AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
					<div>
						<h4 className="font-semibold">Gagal Menghapus Ruangan</h4>
						<p className="text-sm text-rose-700 mt-1">{error}</p>
					</div>
				</div>
			)}

			{/* Loading State */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-20 gap-3">
					<Loader2 className="w-8 h-8 animate-spin text-[#705D00]" />
					<p className="text-stone-500 text-sm font-medium">Memuat daftar ruangan...</p>
				</div>
			) : fetchError ? (
				<div className="p-8 bg-rose-50 border border-rose-100 rounded-[32px] text-center max-w-md mx-auto">
					<AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
					<h3 className="font-poppins font-bold text-lg text-stone-900 mb-2">Gagal Memuat Data</h3>
					<p className="text-stone-600 text-sm mb-6">
						Terjadi kesalahan saat mengambil daftar ruangan dari server.
					</p>
					<button
						onClick={() => mutate('/admin/rooms')}
						className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition-colors">
						Coba Lagi
					</button>
				</div>
			) : rooms.length === 0 ? (
				<div className="p-12 bg-stone-50 border border-stone-100 rounded-[32px] text-center max-w-md mx-auto">
					<DoorOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
					<h3 className="font-poppins font-bold text-lg text-stone-900 mb-2">Belum Ada Ruangan</h3>
					<p className="text-stone-600 text-sm mb-6">
						Belum ada ruangan studio yang terdaftar di sistem.
					</p>
				</div>
			) : (
				/* Rooms Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{rooms.map(room => (
						<div
							key={room.id}
							className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-[0px_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0px_8px_30px_rgb(0,0,0,0.03)] transition-all flex flex-col justify-between gap-6 group">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="p-3 bg-stone-50 rounded-2xl text-[#705D00] group-hover:bg-[#F9E485]/20 transition-colors">
										<DoorOpen className="w-6 h-6" />
									</div>
									<button
										onClick={() => handleDelete(room.id)}
										disabled={deletingId === room.id}
										className="p-2.5 bg-stone-50 hover:bg-rose-50 text-stone-600 hover:text-rose-600 rounded-full transition-colors disabled:opacity-50"
										title="Hapus Ruangan">
										{deletingId === room.id ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Trash2 className="w-4 h-4" />
										)}
									</button>
								</div>
								<div>
									<h3 className="font-poppins font-bold text-lg text-stone-900 leading-snug">
										{room.room_name}
									</h3>
									<p className="text-stone-500 text-sm font-inter mt-1">
										ID Ruangan:{' '}
										<code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">{room.id}</code>
									</p>
								</div>
							</div>

							<div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-medium">
								<span>Status</span>
								<span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
									Aktif
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
