'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ShieldAlert } from 'lucide-react';

const loginSchema = z.object({
	email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
	password: z.string().min(6, 'Password minimal 6 karakter'),
});

export default function AdminLoginPage() {
	const { login } = useAuth();
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async data => {
		setError('');
		setIsSubmitting(true);
		try {
			await login(data.email, data.password, true);
		} catch (err) {
			console.error('Admin login error:', err);
			setError(err.response?.data?.message || err.message || 'Email atau password salah.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative min-h-screen w-full flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:py-16 lg:py-24 font-sans overflow-y-auto">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/images/admin-login-bg.png"
					alt="Admin Login Background"
					fill
					priority
					className="object-cover"
				/>
				{/* Warm dark overlay for professional contrast and readability */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/55" />
			</div>

			{/* Login Card */}
			<div className="relative z-10 w-full max-w-[540px] bg-white/70 backdrop-blur-xl border border-white/50 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0px_8px_30px_rgb(0,0,0,0.16)] flex flex-col items-center transition-all duration-300">
				{/* Logo */}
				<div className="relative w-[76px] h-[65px] sm:w-[84px] sm:h-[72px] mb-4 sm:mb-5 hover:scale-105 transition-transform duration-300">
					<Image
						src="/images/logo-435822.png"
						alt="Teras Foto Logo"
						fill
						className="object-contain"
					/>
				</div>

				{/* Title & Subtitle */}
				<h1 className="text-xl sm:text-2xl md:text-[32px] font-bold text-[#1A1C1C] tracking-tight text-center leading-tight mb-1.5 sm:mb-2">
					My Teras Login
				</h1>
				<p className="text-xs sm:text-sm md:text-base text-[#4D4732] text-center max-w-[420px] mb-6 sm:mb-8 leading-relaxed">
					Sign in to manage studio operations and bookings.
				</p>

				{/* Error Alert */}
				{error && (
					<div className="w-full bg-red-50/90 border border-red-200 text-red-600 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm mb-5 flex items-start gap-2 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
						<ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
						<span>{error}</span>
					</div>
				)}

				{/* Form */}
				<form className="w-full space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{/* Email Input */}
					<div className="space-y-1.5 sm:space-y-2">
						<label className="block text-[10px] sm:text-xs font-semibold text-[#7E775F] tracking-[0.08em] uppercase select-none">
							ADMIN USER NAME / EMAIL
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-3.5 sm:left-4 flex items-center pointer-events-none text-[#7E775F]">
								<Mail className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>
							<input
								type="email"
								autoComplete="email"
								{...register('email')}
								className={`w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3.5 bg-white border-2 rounded-[16px] sm:rounded-[20px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FFD701]/25 hover:border-[#E2DCD0] focus:border-[#FFD701] transition-all text-xs sm:text-sm md:text-base ${
									errors.email ? 'border-red-500' : 'border-[#F1EEE6]'
								}`}
								placeholder="Enter Your Studio ID / Email"
							/>
						</div>
						{errors.email && <p className="text-[11px] sm:text-xs text-red-500 pl-2">{errors.email.message}</p>}
					</div>

					{/* Password Input */}
					<div className="space-y-1.5 sm:space-y-2">
						<label className="block text-[10px] sm:text-xs font-semibold text-[#7E775F] tracking-[0.08em] uppercase select-none">
							PASSWORD
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-3.5 sm:left-4 flex items-center pointer-events-none text-[#7E775F]">
								<Lock className="w-4 h-4 sm:w-5 sm:h-5" />
							</div>
							<input
								type={showPassword ? 'text' : 'password'}
								autoComplete="current-password"
								{...register('password')}
								className={`w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-2.5 sm:py-3.5 bg-white border-2 rounded-[16px] sm:rounded-[20px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FFD701]/25 hover:border-[#E2DCD0] focus:border-[#FFD701] transition-all text-xs sm:text-sm md:text-base ${
									errors.password ? 'border-red-500' : 'border-[#F1EEE6]'
								}`}
								placeholder="••••••••"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								className="absolute inset-y-0 right-3.5 sm:right-4 flex items-center text-[#7E775F] hover:text-gray-700 focus:outline-none rounded-full p-1 transition-colors">
								{showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
							</button>
						</div>
						{errors.password && (
							<p className="text-[11px] sm:text-xs text-red-500 pl-2">{errors.password.message}</p>
						)}
					</div>

					{/* MFA Warning Box */}
					<div className="bg-[#FBF6DD]/95 border border-[#F3E08F] rounded-[16px] sm:rounded-[20px] p-3.5 sm:p-4 flex gap-2.5 sm:gap-3 shadow-sm">
						<ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-[#D9C678] shrink-0 mt-0.5" />
						<p className="text-[11px] sm:text-xs md:text-sm text-[#6C5E1B] leading-relaxed">
							Autentikasi multi-faktor telah aktif. Anda akan diminta memasukkan kunci keamanan
							perangkat keras Anda setelah langkah ini.
						</p>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-3 sm:py-3.5 bg-[#FFD701] hover:bg-[#F2CB00] active:scale-[0.98] text-[#544700] font-semibold rounded-[16px] sm:rounded-[20px] shadow-[0px_4px_12px_rgba(255,215,1,0.2)] hover:shadow-[0px_6px_16px_rgba(255,215,1,0.35)] focus:ring-4 focus:ring-[#FFD701]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base cursor-pointer">
						<span>{isSubmitting ? 'Processing...' : 'Admin Login'}</span>
					</button>
				</form>
			</div>
		</div>
	);
}
