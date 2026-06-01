'use client';

import CreateServiceForm from '@/components/features/services/CreateServiceForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateServicePage() {
	return (
		<div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
			{/* Breadcrumb / Back Button */}
			<div className="flex items-center gap-2">
				<Link
					href="/admin/services"
					className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-[#705D00] transition-colors group">
					<ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
					Kembali ke Manajemen Layanan
				</Link>
			</div>

			{/* Header Section */}
			<div className="flex flex-col gap-1">
				<h1 className="font-poppins font-bold text-3xl text-[#111111] tracking-tight">
					Tambah Layanan Baru
				</h1>
				<p className="text-stone-500 text-sm font-inter">
					Buat paket foto atau layanan studio baru untuk pelanggan Anda.
				</p>
			</div>

			{/* Form Container Card */}
			<div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-10 shadow-[0px_8px_30px_rgb(0,0,0,0.02)]">
				<CreateServiceForm />
			</div>
		</div>
	);
}
