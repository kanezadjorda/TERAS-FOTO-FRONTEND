'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getAdminServices, deleteService } from '@/lib/services/serviceService';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Trash2, Loader2, AlertCircle, Camera, Clock, Tag } from 'lucide-react';
import { formatRupiah } from '@/utils/format';

export default function AdminServicesClient({ initialServices }) {
	const [deletingId, setDeletingId] = useState(null);
	const [error, setError] = useState(null);

	// Fetch daftar layanan dari endpoint admin baru dengan fallback data
	const {
		data: servicesResponse,
		error: fetchError,
		isLoading,
	} = useSWR('/admin/services', () => getAdminServices(), {
		fallbackData: { data: initialServices }
	});

	const services = servicesResponse?.data || [];

	const handleDelete = async id => {
		if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;

		setDeletingId(id);
		setError(null);

		try {
			await deleteService(id);
			// Revalidate data SWR
			mutate('/admin/services');
		} catch (err) {
			console.error('Error deleting service:', err);
			setError(err.message || 'Gagal menghapus layanan.');
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
						Manajemen Layanan
					</h1>
					<p className="text-stone-500 text-sm font-inter">
						Kelola paket foto, harga, durasi, dan ruangan studio Anda.
					</p>
				</div>
				<Link
					href="/admin/services/create"
					className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#705D00] hover:bg-[#5c4b00] text-white font-poppins font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm">
					<Plus className="w-4 h-4" />
					Tambah Layanan
				</Link>
			</div>

			{/* Error Alert */}
			{error && (
				<div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800">
					<AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
					<div>
						<h4 className="font-semibold">Gagal Menghapus Layanan</h4>
						<p className="text-sm text-rose-700 mt-1">{error}</p>
					</div>
				</div>
			)}

			{/* Loading State */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-20 gap-3">
					<Loader2 className="w-8 h-8 animate-spin text-[#705D00]" />
					<p className="text-stone-500 text-sm font-medium">Memuat daftar layanan...</p>
				</div>
			) : fetchError ? (
				<div className="p-8 bg-rose-50 border border-rose-100 rounded-[32px] text-center max-w-md mx-auto">
					<AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
					<h3 className="font-poppins font-bold text-lg text-stone-900 mb-2">Gagal Memuat Data</h3>
					<p className="text-stone-600 text-sm mb-6">
						Terjadi kesalahan saat mengambil daftar layanan dari server.
					</p>
					<button
						onClick={() => mutate('/admin/services')}
						className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition-colors">
						Coba Lagi
					</button>
				</div>
			) : services.length === 0 ? (
				<div className="p-12 bg-stone-50 border border-stone-100 rounded-[32px] text-center max-w-md mx-auto">
					<Camera className="w-12 h-12 text-stone-400 mx-auto mb-4" />
					<h3 className="font-poppins font-bold text-lg text-stone-900 mb-2">Belum Ada Layanan</h3>
					<p className="text-stone-600 text-sm mb-6">
						Mulai tambahkan paket foto atau layanan studio pertama Anda sekarang.
					</p>
					<Link
						href="/admin/services/create"
						className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#705D00] hover:bg-[#5c4b00] text-white text-sm font-semibold rounded-xl transition-colors">
						<Plus className="w-4 h-4" />
						Tambah Layanan
					</Link>
				</div>
			) : (
				/* Services Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{services.map(service => (
						<div
							key={service.id}
							className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-[0px_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0px_8px_30px_rgb(0,0,0,0.03)] transition-all flex flex-col group">
							{/* Image Container */}
							<div className="relative aspect-video bg-stone-100 overflow-hidden">
								{service.thumbnail_url ? (
									<Image
										src={service.thumbnail_url}
										alt={service.service_name}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center text-stone-400">
										<Camera className="w-10 h-10 stroke-[1.5]" />
									</div>
								)}
								<div className="absolute top-4 right-4">
									<button
										onClick={() => handleDelete(service.id)}
										disabled={deletingId === service.id}
										className="p-2.5 bg-white/90 hover:bg-rose-50 text-stone-600 hover:text-rose-600 rounded-full backdrop-blur-sm shadow-sm transition-colors disabled:opacity-50"
										title="Hapus Layanan">
										{deletingId === service.id ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Trash2 className="w-4 h-4" />
										)}
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="p-6 flex-1 flex flex-col justify-between gap-6">
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-600 text-xs font-semibold rounded-full">
											<Tag className="w-3 h-3" />
											{service.room?.room_name || 'Studio'}
										</span>
									</div>
									<h3 className="font-poppins font-bold text-lg text-stone-900 leading-snug">
										{service.service_name}
									</h3>
									<p className="text-stone-500 text-sm font-inter line-clamp-2">
										{service.description}
									</p>
								</div>

								<div className="pt-4 border-t border-stone-100 flex items-center justify-between">
									<div className="flex flex-col">
										<span className="text-xs text-stone-400 font-medium">Harga</span>
										<span className="font-poppins font-bold text-base text-[#705D00]">
											{formatRupiah(service.price)}
										</span>
									</div>
									<div className="flex items-center gap-1.5 text-stone-500 text-sm font-medium">
										<Clock className="w-4 h-4 text-stone-400" />
										{service.duration_minutes} Menit
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
