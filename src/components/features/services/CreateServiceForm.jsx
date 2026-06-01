'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useSWR from 'swr';
import { getAllRooms } from '@/lib/services/roomService';
import { createService, uploadImage } from '@/lib/services/serviceService';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Skema validasi menggunakan Zod
const serviceSchema = z.object({
	service_name: z.string().min(3, 'Nama layanan minimal harus 3 karakter'),
	description: z.string().min(1, 'Deskripsi wajib diisi'),
	price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
	duration_minutes: z.coerce.number().min(1, 'Durasi minimal harus 1 menit'),
	room_id: z.string().min(1, 'Ruangan wajib dipilih'),
});

export default function CreateServiceForm() {
	const router = useRouter();
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImageFilePreview] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	// Fetch daftar ruangan aktif dari endpoint publik /rooms sesuai instruksi kerja 2 poin 4
	const {
		data: roomsResponse,
		error: roomsError,
		isLoading: roomsLoading,
	} = useSWR('/rooms', () => getAllRooms());

	const rooms = roomsResponse?.data || [];

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			service_name: '',
			description: '',
			price: '',
			duration_minutes: '',
			room_id: '',
		},
	});

	const handleImageChange = e => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageFilePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = async data => {
		setIsSubmitting(true);
		setSubmitError(null);
		setSubmitSuccess(false);

		try {
			let imageUrl = '';

			// Langkah 1: Upload gambar jika ada (Dua-Step Upload: Upload ke Vercel Blob via Backend /upload)
			if (imageFile) {
				const formData = new FormData();
				formData.append('image', imageFile);

				// Menggunakan endpoint /upload sesuai instruksi kerja 2 poin 5
				const uploadResponse = await uploadImage(formData);
				imageUrl = uploadResponse?.image_url || uploadResponse?.data?.image_url || '';

				if (!imageUrl) {
					throw new Error('Gagal mendapatkan URL gambar setelah upload.');
				}
			}

			// Langkah 2: Simpan data layanan dengan menggabungkan URL gambar (thumbnail_url)
			const payload = {
				...data,
				thumbnail_url: imageUrl,
			};

			// Menggunakan endpoint /services sesuai instruksi kerja 2 poin 5
			await createService(payload);

			setSubmitSuccess(true);
			reset();
			setImageFile(null);
			setImageFilePreview(null);

			// Redirect ke halaman daftar layanan setelah sukses (opsional, beri jeda sedikit)
			setTimeout(() => {
				router.push('/admin/services'); // Mengarahkan ke halaman manajemen layanan
			}, 2000);
		} catch (err) {
			console.error('Error creating service:', err);
			setSubmitError(err.message || 'Terjadi kesalahan saat menyimpan layanan.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{submitSuccess && (
				<div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800">
					<CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
					<div>
						<h4 className="font-semibold">Layanan Berhasil Ditambahkan!</h4>
						<p className="text-sm text-emerald-700 mt-1">
							Layanan baru telah berhasil disimpan dan gambar telah diunggah. Mengalihkan halaman...
						</p>
					</div>
				</div>
			)}

			{submitError && (
				<div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800">
					<AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
					<div>
						<h4 className="font-semibold">Gagal Menambahkan Layanan</h4>
						<p className="text-sm text-rose-700 mt-1">{submitError}</p>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column: Upload Image */}
				<div className="lg:col-span-1 space-y-4">
					<label className="block font-poppins font-semibold text-sm text-[#111111]">
						Foto Layanan
					</label>
					<div className="relative border-2 border-dashed border-gray-200 hover:border-[#705D00] rounded-[24px] transition-colors overflow-hidden bg-gray-50 aspect-video lg:aspect-square flex flex-col items-center justify-center p-6 text-center group">
						{imagePreview ? (
							<>
								<img
									src={imagePreview}
									alt="Preview"
									className="absolute inset-0 w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
										Ubah Gambar
									</span>
								</div>
							</>
						) : (
							<div className="flex flex-col items-center">
								<div className="p-4 bg-white rounded-full shadow-sm mb-4 text-gray-400 group-hover:text-[#705D00] transition-colors">
									<Upload className="w-6 h-6" />
								</div>
								<p className="font-medium text-sm text-gray-700 mb-1">
									Pilih atau seret gambar ke sini
								</p>
								<p className="text-xs text-gray-500">
									Mendukung format PNG, JPG, atau WEBP (Maks. 5MB)
								</p>
							</div>
						)}
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
					</div>
				</div>

				{/* Right Column: Form Fields */}
				<div className="lg:col-span-2 space-y-6">
					{/* Service Name */}
					<div className="space-y-2">
						<label
							htmlFor="service_name"
							className="block font-poppins font-semibold text-sm text-[#111111]">
							Nama Layanan <span className="text-rose-500">*</span>
						</label>
						<input
							id="service_name"
							type="text"
							{...register('service_name')}
							placeholder="Contoh: Self Photo Studio - Couple"
							className={`w-full px-5 py-4 rounded-2xl border ${
								errors.service_name
									? 'border-rose-500 focus:ring-rose-200'
									: 'border-gray-200 focus:border-[#705D00] focus:ring-[#705D00]/10'
							} focus:outline-none focus:ring-4 transition-all font-inter text-sm`}
						/>
						{errors.service_name && (
							<p className="text-xs text-rose-500 font-medium">{errors.service_name.message}</p>
						)}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label
							htmlFor="description"
							className="block font-poppins font-semibold text-sm text-[#111111]">
							Deskripsi Layanan <span className="text-rose-500">*</span>
						</label>
						<textarea
							id="description"
							rows={4}
							{...register('description')}
							placeholder="Jelaskan detail layanan, apa saja yang didapatkan pelanggan, dll..."
							className={`w-full px-5 py-4 rounded-2xl border ${
								errors.description
									? 'border-rose-500 focus:ring-rose-200'
									: 'border-gray-200 focus:border-[#705D00] focus:ring-[#705D00]/10'
							} focus:outline-none focus:ring-4 transition-all font-inter text-sm resize-none`}
						/>
						{errors.description && (
							<p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Price */}
						<div className="space-y-2">
							<label
								htmlFor="price"
								className="block font-poppins font-semibold text-sm text-[#111111]">
								Harga (Rp) <span className="text-rose-500">*</span>
							</label>
							<div className="relative">
								<span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
									Rp
								</span>
								<input
									id="price"
									type="number"
									{...register('price')}
									placeholder="150000"
									className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${
										errors.price
											? 'border-rose-500 focus:ring-rose-200'
											: 'border-gray-200 focus:border-[#705D00] focus:ring-[#705D00]/10'
									} focus:outline-none focus:ring-4 transition-all font-inter text-sm`}
								/>
							</div>
							{errors.price && (
								<p className="text-xs text-rose-500 font-medium">{errors.price.message}</p>
							)}
						</div>

						{/* Duration */}
						<div className="space-y-2">
							<label
								htmlFor="duration_minutes"
								className="block font-poppins font-semibold text-sm text-[#111111]">
								Durasi (Menit) <span className="text-rose-500">*</span>
							</label>
							<input
								id="duration_minutes"
								type="number"
								{...register('duration_minutes')}
								placeholder="45"
								className={`w-full px-5 py-4 rounded-2xl border ${
									errors.duration_minutes
										? 'border-rose-500 focus:ring-rose-200'
										: 'border-gray-200 focus:border-[#705D00] focus:ring-[#705D00]/10'
								} focus:outline-none focus:ring-4 transition-all font-inter text-sm`}
							/>
							{errors.duration_minutes && (
								<p className="text-xs text-rose-500 font-medium">
									{errors.duration_minutes.message}
								</p>
							)}
						</div>
					</div>

					{/* Room Selection */}
					<div className="space-y-2">
						<label
							htmlFor="room_id"
							className="block font-poppins font-semibold text-sm text-[#111111]">
							Ruangan Studio <span className="text-rose-500">*</span>
						</label>
						<select
							id="room_id"
							{...register('room_id')}
							disabled={roomsLoading}
							className={`w-full px-5 py-4 rounded-2xl border ${
								errors.room_id
									? 'border-rose-500 focus:ring-rose-200'
									: 'border-gray-200 focus:border-[#705D00] focus:ring-[#705D00]/10'
							} focus:outline-none focus:ring-4 transition-all font-inter text-sm bg-white appearance-none`}>
							<option value="">
								{roomsLoading ? 'Memuat ruangan...' : 'Pilih Ruangan Studio'}
							</option>
							{rooms.map(room => (
								<option key={room.id} value={room.id}>
									{room.room_name}
								</option>
							))}
						</select>
						{roomsError && (
							<p className="text-xs text-rose-500 font-medium">Gagal memuat daftar ruangan.</p>
						)}
						{errors.room_id && (
							<p className="text-xs text-rose-500 font-medium">{errors.room_id.message}</p>
						)}
					</div>

					{/* Submit Button */}
					<div className="pt-4 flex justify-end">
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-8 py-4 bg-[#705D00] hover:bg-[#5c4b00] disabled:bg-gray-300 text-white font-poppins font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
							{isSubmitting ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Menyimpan...
								</>
							) : (
								'Tambah Layanan'
							)}
						</button>
					</div>
				</div>
			</div>
		</form>
	);
}
