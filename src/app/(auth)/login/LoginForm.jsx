'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const loginSchema = z.object({
	email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
	password: z.string().min(6, 'Password minimal harus 6 karakter'),
});

export default function LoginForm() {
	const { login, loginWithGoogle } = useAuth();
	const [serverError, setServerError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async data => {
		setServerError('');
		try {
			await login(data.email, data.password);
		} catch (error) {
			setServerError(error.message || 'Email atau password salah. Silakan coba lagi.');
		}
	};

	const emailField = register('email');
	const passwordField = register('password');

	return (
		<div className="mx-auto w-full max-w-[544px] space-y-8">
			{/* Tab Navigation */}
			<div className="relative border-b border-[#F1EEE6] pb-px">
				<div className="flex gap-8">
					<button className="relative pb-4 text-lg font-semibold text-[#705D00] focus:outline-none">
						Sign In
						<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#705D00]" />
					</button>
					<Link
						href="/register"
						className="pb-4 text-lg font-semibold text-[#4D4732]/60 hover:text-[#705D00] transition-colors focus:outline-none">
						Create Account
					</Link>
				</div>
			</div>

			{/* Header */}
			<div className="space-y-3">
				<h1 className="font-poppins text-3xl font-bold tracking-tight text-[#1A1C1C]">
					Welcome Back
				</h1>
				<p className="font-poppins text-sm text-[#4D4732]">
					Please enter your details to access your studio dashboard.
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

			{/* Form */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-poppins">
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

				{/* Password Input */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label
							htmlFor="password"
							className="block text-xs font-semibold tracking-widest text-[#7E775F] uppercase">
							PASSWORD
						</label>
						<Link
							href="/forgot-password"
							className="text-xs font-semibold text-[#705D00] hover:underline">
							Forgot Password?
						</Link>
					</div>
					<div className="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							autoComplete="current-password"
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

				{/* Submit Button */}
				<Button
					type="submit"
					className="w-full h-[55px] rounded-[20px] bg-[#FFD701] hover:bg-[#e6c200] text-[#705D00] font-semibold text-base shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-none transition-all"
					disabled={isSubmitting}>
					{isSubmitting ? 'Signing In...' : 'Sign In'}
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

			{/* Google Sign In Button */}
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
					text="signin_with"
					width="100%"
				/>
			</div>

			{/* Footer Terms */}
			<p className="text-center text-xs text-[#4D4732]/80 leading-relaxed max-w-[449px] mx-auto">
				By signing up, you agree to our{' '}
				<Link href="/privacy" className="underline hover:text-[#705D00]">
					Privacy Policy
				</Link>{' '}
				and{' '}
				<Link href="/terms" className="underline hover:text-[#705D00]">
					Terms of Service
				</Link>
			</p>
		</div>
	);
}
