'use client';

import { useState, useEffect } from 'react';
import { Camera, Shield, Bell, Palette } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
	const { user } = useAuth();
	const [mounted, setMounted] = useState(false);
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		phoneNumber: '+62 812 3456 7890',
		location: 'Jakarta, Indonesia',
		currentPassword: '••••••••',
		newPassword: '',
	});

	// Set mounted ke true setelah komponen ter-mount di client
	useEffect(() => {
		setMounted(true);
	}, []);

	// Isi formData di client-side setelah mount untuk menghindari cascading render warning di SSR
	useEffect(() => {
		if (mounted && user) {
			// Gunakan setTimeout atau requestAnimationFrame untuk memindahkan pembaruan state ke luar siklus render sinkron
			const timer = setTimeout(() => {
				setFormData(prev => {
					if (prev.fullName === user.full_name && prev.email === user.email) {
						return prev;
					}
					return {
						...prev,
						fullName: user.full_name || 'Alex Rivera',
						email: user.email || 'alex@terasfoto.com',
					};
				});
			}, 0);
			return () => clearTimeout(timer);
		}
	}, [mounted, user]);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = e => {
		e.preventDefault();
		alert('Changes saved successfully!');
	};

	// Tentukan nama dan email yang ditampilkan di profil (fallback ke Alex Rivera jika belum dimuat)
	const profileName = user?.full_name || formData.fullName || 'Alex Rivera';
	const profileEmail = user?.email || formData.email || 'alex@terasfoto.com';

	// Cegah render dinamis sebelum hydration selesai untuk menghindari mismatch
	if (!mounted) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="w-8 h-8 border-4 border-[#705D00] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-12 max-w-[1000px] mx-auto pb-12">
			{/* Main Settings Card */}
			<div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-12 md:gap-16">
				{/* Left Column: Profile Info */}
				<div className="flex flex-col items-center text-center md:w-[240px] shrink-0 md:border-r md:border-gray-100 md:pr-12">
					{/* Avatar Container */}
					<div className="relative w-32 h-32 rounded-full p-1 border-2 border-[#705D00] mb-6">
						<div className="relative w-full h-full rounded-full overflow-hidden bg-gray-100">
							<Image
								src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"
								alt={profileName}
								fill
								sizes="128px"
								className="object-cover"
								priority
							/>
						</div>
						{/* Camera Edit Button */}
						<button className="absolute bottom-1 right-1 p-2 bg-[#705D00] hover:bg-[#5c4b00] text-white rounded-full shadow-md transition-colors border-2 border-white">
							<Camera className="w-4 h-4" />
						</button>
					</div>

					{/* Name & Role */}
					<h2 className="font-poppins font-bold text-xl text-[#111111] mb-1">{profileName}</h2>
					<p className="font-inter text-xs text-gray-500 leading-relaxed mb-6">
						{user?.role_id === 1 ? 'Owner / Admin' : 'Staff'}
						<br />& Admin
					</p>

					{/* Member Since Badge */}
					<div className="bg-[#FAF8F0] border border-[#EFECE0] rounded-2xl px-6 py-3 w-full">
						<span className="block font-inter text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
							Member Since
						</span>
						<span className="font-poppins font-bold text-sm text-[#705D00]">October 2023</span>
					</div>
				</div>

				{/* Right Column: Form */}
				<form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8">
					{/* Personal Details Section */}
					<div className="flex flex-col gap-6">
						<h3 className="font-poppins font-bold text-lg text-[#705D00]">Personal Details</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							{/* Full Name */}
							<div className="flex flex-col gap-2">
								<label className="font-inter text-xs font-medium text-gray-500">Full Name</label>
								<input
									type="text"
									name="fullName"
									value={formData.fullName}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-poppins font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20 focus:border-[#705D00] transition-all"
								/>
							</div>

							{/* Email Address */}
							<div className="flex flex-col gap-2">
								<label className="font-inter text-xs font-medium text-gray-500">
									Email Address
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-poppins font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20 focus:border-[#705D00] transition-all"
								/>
							</div>

							{/* Phone Number */}
							<div className="flex flex-col gap-2">
								<label className="font-inter text-xs font-medium text-gray-500">Phone Number</label>
								<input
									type="text"
									name="phoneNumber"
									value={formData.phoneNumber}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-poppins font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20 focus:border-[#705D00] transition-all"
								/>
							</div>

							{/* Location */}
							<div className="flex flex-col gap-2">
								<label className="font-inter text-xs font-medium text-gray-500">Location</label>
								<input
									type="text"
									name="location"
									value={formData.location}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-poppins font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20 focus:border-[#705D00] transition-all"
								/>
							</div>
						</div>
					</div>

					{/* Security Section */}
					<div className="flex flex-col gap-6">
						<h3 className="font-poppins font-bold text-lg text-[#705D00]">Security</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							{/* Current Password */}
							<div className="flex flex-col gap-2">
								<label className="font-inter text-xs font-medium text-gray-500">
									Current Password
								</label>
								<input
									type="password"
									name="currentPassword"
									value={formData.currentPassword}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-poppins font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20 focus:border-[#705D00] transition-all"
								/>
							</div>

							{/* New Password */}
							<div className="flex flex-col gap-2">
								<label className="font-inter text-xs font-medium text-gray-500">New Password</label>
								<input
									type="password"
									name="newPassword"
									placeholder="Leave blank to keep same"
									value={formData.newPassword}
									onChange={handleChange}
									className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-poppins font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#705D00]/20 focus:border-[#705D00] transition-all"
								/>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end items-center gap-4 mt-4">
						<button
							type="button"
							className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-poppins font-bold text-xs tracking-wider rounded-xl transition-colors uppercase shadow-sm">
							Cancel
						</button>
						<button
							type="submit"
							className="px-6 py-3 bg-[#705D00] hover:bg-[#5c4b00] text-white font-poppins font-bold text-xs tracking-wider rounded-xl transition-colors uppercase shadow-sm">
							Save Changes
						</button>
					</div>
				</form>
			</div>

			{/* Bottom Feature Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Privacy Control */}
				<div className="bg-[#FAF8F0] border border-[#EFECE0] rounded-[24px] p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
					<div className="p-2 bg-white rounded-xl w-fit text-[#705D00] shadow-sm">
						<Shield className="w-5 h-5" />
					</div>
					<h4 className="font-poppins font-bold text-sm text-[#705D00] mt-1">Privacy Control</h4>
					<p className="font-inter text-xs text-gray-500 leading-relaxed">
						Manage who can see your portfolio and contact information.
					</p>
				</div>

				{/* Preferences */}
				<div className="bg-[#FAF8F0] border border-[#EFECE0] rounded-[24px] p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
					<div className="p-2 bg-white rounded-xl w-fit text-[#705D00] shadow-sm">
						<Bell className="w-5 h-5" />
					</div>
					<h4 className="font-poppins font-bold text-sm text-[#705D00] mt-1">Preferences</h4>
					<p className="font-inter text-xs text-gray-500 leading-relaxed">
						Customize your dashboard notifications and email reports.
					</p>
				</div>

				{/* Branding */}
				<div className="bg-[#FAF8F0] border border-[#EFECE0] rounded-[24px] p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
					<div className="p-2 bg-white rounded-xl w-fit text-[#705D00] shadow-sm">
						<Palette className="w-5 h-5" />
					</div>
					<h4 className="font-poppins font-bold text-sm text-[#705D00] mt-1">Branding</h4>
					<p className="font-inter text-xs text-gray-500 leading-relaxed">
						Adjust your studios public aesthetic and watermark styles.
					</p>
				</div>
			</div>

			{/* Footer */}
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 pt-8 text-gray-400 text-xs font-inter">
				<span>© 2024 Teras Foto Studio. Captured with warmth.</span>
				<div className="flex items-center gap-6">
					<Link href="/privacy" className="hover:text-gray-600 transition-colors">
						Privacy Policy
					</Link>
					<Link href="/terms" className="hover:text-gray-600 transition-colors">
						Terms of Service
					</Link>
				</div>
			</div>
		</div>
	);
}
