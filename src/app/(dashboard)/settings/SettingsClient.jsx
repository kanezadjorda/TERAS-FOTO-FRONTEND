'use client';

import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react';

export default function SettingsClient() {
	const { user, logout } = useAuth();

	return (
		<div className="w-full max-w-[1440px] mx-auto">
			{/* Header */}
			<div className="mb-10">
				<h1 className="font-poppins font-bold text-[36px] text-[#1A1C1C] leading-[46.8px] tracking-[-1%] mb-2">
					Account Settings
				</h1>
				<p className="font-poppins text-[18px] text-[#4D4732] leading-[28.8px]">
					Manage your personal information and account preferences.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column - Profile Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Personal Information Card */}
					<div className="bg-white rounded-2xl border border-[#F1EEE6] p-6 shadow-sm">
						<div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F1EEE6]">
							<div className="w-10 h-10 rounded-full bg-[#FEF9C3] flex items-center justify-center text-[#705D00]">
								<User className="w-5 h-5" />
							</div>
							<div>
								<h2 className="font-poppins font-semibold text-[20px] text-[#1A1C1C]">
									Personal Information
								</h2>
								<p className="font-poppins text-sm text-[#4D4732]">
									Your basic profile information
								</p>
							</div>
						</div>

						<div className="space-y-5">
							<div>
								<label className="block font-poppins text-sm font-medium text-[#4D4732] mb-1.5">
									Full Name
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<User className="w-4 h-4 text-[#9CA3AF]" />
									</div>
									<input
										type="text"
										readOnly
										value={user?.full_name || 'Loading...'}
										className="w-full pl-11 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl font-poppins text-sm text-[#1A1C1C] focus:outline-none cursor-not-allowed"
									/>
								</div>
							</div>

							<div>
								<label className="block font-poppins text-sm font-medium text-[#4D4732] mb-1.5">
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<Mail className="w-4 h-4 text-[#9CA3AF]" />
									</div>
									<input
										type="email"
										readOnly
										value={user?.email || 'Loading...'}
										className="w-full pl-11 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl font-poppins text-sm text-[#1A1C1C] focus:outline-none cursor-not-allowed"
									/>
								</div>
							</div>

							<div>
								<label className="block font-poppins text-sm font-medium text-[#4D4732] mb-1.5">
									Phone Number
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
										<Phone className="w-4 h-4 text-[#9CA3AF]" />
									</div>
									<input
										type="tel"
										readOnly
										value={user?.phone_number || '-'}
										className="w-full pl-11 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl font-poppins text-sm text-[#1A1C1C] focus:outline-none cursor-not-allowed"
										placeholder="Not provided"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Security & Actions */}
				<div className="space-y-6">
					{/* Security Card */}
					<div className="bg-white rounded-2xl border border-[#F1EEE6] p-6 shadow-sm">
						<div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F1EEE6]">
							<div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#4B5563]">
								<Shield className="w-5 h-5" />
							</div>
							<div>
								<h2 className="font-poppins font-semibold text-[20px] text-[#1A1C1C]">Security</h2>
							</div>
						</div>

						<div className="space-y-4">
							<div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
								<p className="font-poppins text-sm text-[#4D4732] mb-3">
									Password management is currently handled by the administrator. If you need to
									reset your password, please contact support.
								</p>
								<button
									disabled
									className="w-full py-2.5 px-4 bg-white border border-[#D1D5DB] rounded-lg font-poppins text-sm font-medium text-[#6B7280] cursor-not-allowed">
									Change Password
								</button>
							</div>
						</div>
					</div>

					{/* Danger Zone */}
					<div className="bg-white rounded-2xl border border-[#FEE2E2] p-6 shadow-sm">
						<h2 className="font-poppins font-semibold text-[20px] text-[#991B1B] mb-2">
							Account Actions
						</h2>
						<p className="font-poppins text-sm text-[#7F1D1D] mb-6">
							Sign out of your account on this device.
						</p>

						<button
							onClick={logout}
							className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl font-poppins text-sm font-bold text-[#DC2626] transition-colors">
							<LogOut className="w-4 h-4" />
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
