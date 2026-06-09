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

	const emailField = register('email');
	const passwordField = register('password');

	return (
		<div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/images/admin-login-bg.png"
					alt="Admin Login Background"
					fill
					priority
					className="object-cover"
				/>
				{/* Dark overlay to ensure readability */}
				<div className="absolute inset-0 bg-black/30" />
			</div>

			{/* Login Card */}
			<div className="relative z-10 w-full max-w-[617px] mx-4 bg-white/60 backdrop-blur-md border border-[#F1EEE6] rounded-[40px] md:rounded-[69px] p-8 md:p-12 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-center">
				{/* Logo */}
				<div className="relative w-[84px] h-[72px] mb-6">
					<Image
						src="/images/logo-435822.png"
						alt="Teras Foto Logo"
						fill
						className="object-contain"
					/>
				</div>

				{/* Title & Subtitle */}
				<h1 className="text-2xl md:text-[36px] font-bold text-[#1A1C1C] tracking-tight text-center leading-tight mb-2">
					My Teras Login
				</h1>
				<p className="text-sm md:text-base text-[#4D4732] text-center max-w-[477px] mb-8 leading-relaxed">
					Sign in to manage studio operations and bookings.
				</p>

				{/* Error Alert */}
				{error && (
					<div className="w-full bg-red-50/90 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 flex items-start gap-2">
						<ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
						<span>{error}</span>
					</div>
				)}

				{/* Form */}
				<form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{/* Email Input */}
					<div className="space-y-2">
						<label className="block text-xs font-semibold text-[#7E775F] tracking-[0.1em] uppercase">
							ADMIN USER NAME / EMAIL
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7E775F]">
								<Mail className="w-5 h-5" />
							</div>
							<input
								type="email"
								autoComplete="email"
								name={emailField.name}
								onChange={emailField.onChange}
								onBlur={emailField.onBlur}
								ref={emailField.ref}
								className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-[20px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD701] focus:border-transparent transition-all text-sm md:text-base ${
									errors.email ? 'border-red-500' : 'border-[#F1EEE6]'
								}`}
								placeholder="Enter Your Studio ID / Email"
							/>
						</div>
						{errors.email && <p className="text-xs text-red-500 pl-2">{errors.email.message}</p>}
					</div>

					{/* Password Input */}
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<label className="block text-xs font-semibold text-[#7E775F] tracking-[0.1em] uppercase">
								PASSWORD
							</label>
						</div>
						<div className="relative">
							<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#7E775F]">
								<Lock className="w-5 h-5" />
							</div>
							<input
								type={showPassword ? 'text' : 'password'}
								autoComplete="current-password"
								name={passwordField.name}
								onChange={passwordField.onChange}
								onBlur={passwordField.onBlur}
								ref={passwordField.ref}
								className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-[20px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD701] focus:border-transparent transition-all text-sm md:text-base ${
									errors.password ? 'border-red-500' : 'border-[#F1EEE6]'
								}`}
								placeholder="••••••••"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-4 flex items-center text-[#7E775F] hover:text-gray-700">
								{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
							</button>
						</div>
						{errors.password && (
							<p className="text-xs text-red-500 pl-2">{errors.password.message}</p>
						)}
					</div>

					{/* MFA Warning Box */}
					<div className="bg-[#FBF6DD] border border-[#F3E08F] rounded-[20px] p-4 flex gap-3">
						<ShieldAlert className="w-6 h-6 text-[#D9C678] shrink-0 mt-0.5" />
						<p className="text-xs md:text-sm text-[#6C5E1B] leading-relaxed">
							Autentikasi multi-faktor telah aktif. Anda akan diminta memasukkan kunci keamanan
							perangkat keras Anda setelah langkah ini.
						</p>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-3.5 bg-[#FFD701] hover:bg-[#e6c200] active:scale-[0.98] text-[#705E00] font-semibold rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base">
						<span>{isSubmitting ? 'Processing...' : 'Admin Login'}</span>
					</button>
				</form>
			</div>
		</div>
	);
}
