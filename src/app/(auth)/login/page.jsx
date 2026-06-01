import Link from 'next/link';
import Image from 'next/image';
import LoginForm from './LoginForm';

export default function LoginPage() {
	return (
		<main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
			{/* Sisi Kiri: Visual Showcase & Stats (Desktop Only) */}
			<section className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 text-white overflow-hidden bg-neutral-900">
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

			{/* Sisi Kanan: Form Login */}
			<section className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24 bg-white">
				<LoginForm />
			</section>
		</main>
	);
}
