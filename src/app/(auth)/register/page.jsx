'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const registerSchema = z
	.object({
		fullName: z.string().min(1, 'Nama lengkap wajib diisi'),
		email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
		phoneNumber: z
			.string()
			.min(1, 'Nomor telepon wajib diisi')
			.regex(/^[0-9\s-]{8,15}$/, 'Format nomor telepon tidak valid'),
		password: z.string().min(6, 'Password minimal harus 6 karakter'),
		confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
		agreeTerms: z.boolean().refine(val => val === true, {
			message: 'Anda harus menyetujui Syarat dan Ketentuan',
		}),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Password tidak cocok',
		path: ['confirmPassword'],
	});

export default function RegisterPage() {
	const { register: registerUser, loginWithGoogle } = useAuth();
	const router = useRouter();
	const [serverError, setServerError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			fullName: '',
			email: '',
			phoneNumber: '',
			password: '',
			confirmPassword: '',
			agreeTerms: false,
		},
	});

	const onSubmit = async data => {
		setServerError('');
		setSuccessMessage('');
		try {
			// Backend register expects full_name, email, password.
			// We can also pass phone_number if backend supports it, but let's keep it safe or pass it.
			await registerUser(data.fullName, data.email, data.password);
			setSuccessMessage('Pendaftaran berhasil! Mengarahkan Anda ke halaman login...');
			setTimeout(() => {
				router.push('/login');
			}, 2000);
		} catch (error) {
			setServerError(error.message || 'Pendaftaran gagal. Silakan coba lagi.');
		}
	};

	const fullNameField = register('fullName');
	const emailField = register('email');
	const phoneNumberField = register('phoneNumber');
	const passwordField = register('password');
	const confirmPasswordField = register('confirmPassword');
	const agreeTermsField = register('agreeTerms');

	return (
		<main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white bg-neutral-900">
			{/* Sisi Kiri: Visual Showcase & Stats (Desktop Only) */}
			<section className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 text-white overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<Image
						src="/images/login-bg-5ce9d7.png"
						alt="Teras Foto Studio Background"
						fill
						priority
						sizes="100vw"
						className="object-cover object-bottom"
					/>
					{/* Overlay gradient to ensure text readability */}

					<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
				</div>

				{/* Top Content: Logo */}
				<div className="relative z-10 flex items-center gap-3">
					<div className="relative w-16 h-14">
						<Image
							src="/images/logo-435822.png"
							alt="Teras Foto Logo"
							fill
							sizes="100vw"
							className="object-contain"
						/>
					</div>
				</div>

				{/* Middle Content: Tagline & Description */}
				<div className="relative z-10 max-w-md space-y-4 mt-auto mb-12">
					<h2 className="font-poppins text-4xl font-bold leading-tight tracking-tight text-[#FFD701]">
						Capture Your Story
						<br />
						at Teras.
					</h2>
					<p className="font-poppins text-sm text-white/90 leading-relaxed">
						Professional studio experiences designed for modern creatives. Join our community to
						book sessions and track your memories.
					</p>
				</div>

				{/* Bottom Content: Stats */}
				<div className="relative z-10 flex items-center gap-8 border-t border-white/20 pt-6">
					<div>
						<p className="font-poppins text-2xl font-semibold text-[#FFD701]">1.2k+</p>
						<p className="font-poppins text-xs tracking-wider text-white/70 uppercase mt-1">
							Sessions Hosted
						</p>
					</div>
					<div className="h-10 w-px bg-white/20" />
					<div>
						<p className="font-poppins text-2xl font-semibold text-[#FFD701]">4.9/5</p>
						<p className="font-poppins text-xs tracking-wider text-white/70 uppercase mt-1">
							Client Rating
						</p>
					</div>
				</div>
			</section>

			{/* Sisi Kanan: Form Register */}
			<section className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24 bg-white">
				<div className="mx-auto w-full max-w-[544px] space-y-8">
					{/* Tab Navigation */}
					<div className="relative border-b border-[#F1EEE6] pb-px">
						<div className="flex gap-8">
							<Link
								href="/login"
								className="pb-4 text-lg font-semibold text-[#4D4732]/60 hover:text-[#705D00] transition-colors focus:outline-none">
								Sign In
							</Link>
							<button className="relative pb-4 text-lg font-semibold text-[#705D00] focus:outline-none">
								Create Account
								<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#705D00]" />
							</button>
						</div>
					</div>

					{/* Header */}
					<div className="space-y-3">
						<h1 className="font-poppins text-3xl font-bold tracking-tight text-[#1A1C1C]">
							Create Account
						</h1>
						<p className="font-poppins text-sm text-[#4D4732]">
							Sign up to book sessions and track your creative projects.
						</p>
					</div>

					{/* Server Error Alert */}
					{serverError && (
						<div
							className="p-4 rounded-[20px] bg-red-50 border border-red-100 text-red-600 text-sm font-poppins"
							role="alert">
							{serverError}
						</div>
					)}

					{/* Success Message Alert */}
					{successMessage && (
						<div
							className="p-4 rounded-[20px] bg-green-50 border border-green-100 text-green-600 text-sm font-poppins"
							role="alert">
							{successMessage}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-poppins">
						{/* Full Name Input */}
						<div className="space-y-2">
							<label
								htmlFor="fullName"
								className="block text-xs font-semibold tracking-widest text-[#7E775F] uppercase">
								FULL NAME
							</label>
							<input
								id="fullName"
								type="text"
								autoComplete="name"
								className="block w-full h-[55px] rounded-[20px] border-2 border-[#F1EEE6] px-5 text-slate-900 placeholder-slate-400 focus:border-[#705D00] focus:outline-none focus:ring-0 sm:text-sm transition-colors"
								placeholder="Enter your full name"
								name={fullNameField.name}
								onChange={fullNameField.onChange}
								onBlur={fullNameField.onBlur}
								ref={fullNameField.ref}
							/>
							{errors.fullName && (
								<p className="text-xs text-red-600 font-medium mt-1" id="fullName-error">
									{errors.fullName.message}
								</p>
							)}
						</div>

						{/* Email Input */}
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="block text-xs font-semibold tracking-widest text-[#7E775F] uppercase">
								EMAIL ADDRESS
							</label>
							<input
								id="email"
								type="email"
								autoComplete="email"
								className="block w-full h-[55px] rounded-[20px] border-2 border-[#F1EEE6] px-5 text-slate-900 placeholder-slate-400 focus:border-[#705D00] focus:outline-none focus:ring-0 sm:text-sm transition-colors"
								placeholder="rusdiantoggwp@gmail.com"
								name={emailField.name}
								onChange={emailField.onChange}
								onBlur={emailField.onBlur}
								ref={emailField.ref}
							/>
							{errors.email && (
								<p className="text-xs text-red-600 font-medium mt-1" id="email-error">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Phone Number Input */}
						<div className="space-y-2">
							<label
								htmlFor="phoneNumber"
								className="block text-xs font-semibold tracking-widest text-[#7E775F] uppercase">
								PHONE NUMBER
							</label>
							<div className="flex h-[55px] rounded-[20px] border-2 border-[#F1EEE6] overflow-hidden focus-within:border-[#705D00] transition-colors">
								<div className="flex items-center justify-center bg-[#EEEEEE] px-4 border-r border-[#F1EEE6] text-slate-900 text-sm font-medium">
									+62
								</div>
								<input
									id="phoneNumber"
									type="tel"
									autoComplete="tel"
									className="block w-full h-full px-5 text-slate-900 placeholder-slate-400 focus:outline-none sm:text-sm"
									placeholder="812 3456 7890"
									name={phoneNumberField.name}
									onChange={phoneNumberField.onChange}
									onBlur={phoneNumberField.onBlur}
									ref={phoneNumberField.ref}
								/>
							</div>
							{errors.phoneNumber && (
								<p className="text-xs text-red-600 font-medium mt-1" id="phoneNumber-error">
									{errors.phoneNumber.message}
								</p>
							)}
						</div>

						{/* Password & Confirm Password Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Password Input */}
							<div className="space-y-2">
								<label
									htmlFor="password"
									className="block text-xs font-semibold tracking-widest text-[#7E775F] uppercase">
									PASSWORD
								</label>
								<div className="relative">
									<input
										id="password"
										type={showPassword ? 'text' : 'password'}
										autoComplete="new-password"
										className="block w-full h-[55px] rounded-[20px] border-2 border-[#F1EEE6] pl-5 pr-12 text-slate-900 placeholder-slate-400 focus:border-[#705D00] focus:outline-none focus:ring-0 sm:text-sm transition-colors"
										placeholder="••••••••"
										name={passwordField.name}
										onChange={passwordField.onChange}
										onBlur={passwordField.onBlur}
										ref={passwordField.ref}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7E775F] hover:text-[#705D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-full p-1"
										aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
										{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
									</button>
								</div>
								{errors.password && (
									<p className="text-xs text-red-600 font-medium mt-1" id="password-error">
										{errors.password.message}
									</p>
								)}
							</div>

							{/* Confirm Password Input */}
							<div className="space-y-2">
								<label
									htmlFor="confirmPassword"
									className="block text-xs font-semibold tracking-widest text-[#7E775F] uppercase">
									CONFIRM
								</label>
								<div className="relative">
									<input
										id="confirmPassword"
										type={showConfirmPassword ? 'text' : 'password'}
										autoComplete="new-password"
										className="block w-full h-[55px] rounded-[20px] border-2 border-[#F1EEE6] pl-5 pr-12 text-slate-900 placeholder-slate-400 focus:border-[#705D00] focus:outline-none focus:ring-0 sm:text-sm transition-colors"
										placeholder="••••••••"
										name={confirmPasswordField.name}
										onChange={confirmPasswordField.onChange}
										onBlur={confirmPasswordField.onBlur}
										ref={confirmPasswordField.ref}
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7E775F] hover:text-[#705D00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#705D00] rounded-full p-1"
										aria-label={
											showConfirmPassword
												? 'Sembunyikan konfirmasi password'
												: 'Tampilkan konfirmasi password'
										}>
										{showConfirmPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
								{errors.confirmPassword && (
									<p className="text-xs text-red-600 font-medium mt-1" id="confirmPassword-error">
										{errors.confirmPassword.message}
									</p>
								)}
							</div>
						</div>

						{/* Terms Checkbox */}
						<div className="space-y-2">
							<div className="flex items-start gap-3">
								<div className="flex h-5 items-center">
									<input
										id="agreeTerms"
										type="checkbox"
										className="h-5 w-5 rounded border-2 border-[#F1EEE6] text-[#705D00] focus:ring-[#705D00] transition-colors cursor-pointer"
										name={agreeTermsField.name}
										onChange={agreeTermsField.onChange}
										onBlur={agreeTermsField.onBlur}
										ref={agreeTermsField.ref}
									/>
								</div>
								<label
									htmlFor="agreeTerms"
									className="text-sm text-[#6B7280] cursor-pointer select-none">
									I agree to the Terms of Service and Privacy Policy.
								</label>
							</div>
							{errors.agreeTerms && (
								<p className="text-xs text-red-600 font-medium" id="agreeTerms-error">
									{errors.agreeTerms.message}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full h-[55px] rounded-[20px] bg-[#FFD701] hover:bg-[#e6c200] text-[#705E00] font-semibold text-base shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-none transition-all mt-2"
							disabled={isSubmitting}>
							{isSubmitting ? 'Signing Up...' : 'Sign Up'}
						</Button>
					</form>

					{/* Divider */}
					<div className="relative flex py-2 items-center">
						<div className="flex-grow border-t border-[#F1EEE6]"></div>
						<span className="flex-shrink mx-4 text-[10px] font-semibold tracking-widest text-[#7E775F] uppercase">
							OR CONTINUE WITH
						</span>
						<div className="flex-grow border-t border-[#F1EEE6]"></div>
					</div>

					{/* Google Sign Up Button */}
					<div className="flex justify-center w-full">
						<GoogleLogin
							onSuccess={credentialResponse => {
								loginWithGoogle(credentialResponse.credential).catch(err => {
									setServerError(err.message || 'Google Login Failed');
								});
							}}
							onError={() => {
								setServerError('Google Login Failed');
							}}
							shape="pill"
							theme="outline"
							size="large"
							text="signup_with"
							width="100%"
						/>
					</div>

					{/* Footer Terms */}
					<div className="text-center text-sm font-poppins">
						<span className="text-[#4D4732]/60">Already have an account? </span>
						<Link
							href="/login"
							className="font-semibold text-[#705D00] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 rounded">
							Sign In
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
