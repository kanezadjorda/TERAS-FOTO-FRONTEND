'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServiceDetail({ service }) {
	const router = useRouter();

	if (!service) return null;

	const getServiceSlug = name => {
		return name.toLowerCase().replace(/\s+/g, '-');
	};

	const formattedPrice = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
	}).format(service.price);

	return (
		<div className="w-full min-h-screen bg-white my-23 ">
			{/* Breadcrumbs / Back Button */}
			<div className="max-w-[1445] mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<button
					onClick={() => router.back()}
					className="flex items-center text-[#705D00] font-poppins font-medium hover:underline mb-8">
					<svg
						className="mr-2"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M19 12H5M5 12L12 19M5 12L12 5"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					Kembali ke Katalog
				</button>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
					{/* Left: Info */}
					<div className="flex flex-col order-2 lg:order-1">
						<h1 className="font-poppins font-bold text-4xl md:text-[48px] text-[#1A1C1C] leading-[1.2] tracking-[-0.02em] mb-6">
							{service.service_name}
						</h1>

						<p className="font-poppins text-base text-[#4D4732] leading-[1.5] mb-10">
							{service.description ||
								'Kendalikan narasi Anda sendiri. Stan foto pribadi kami memberi Anda kebebasan untuk menjadi diri sendiri tanpa tekanan dari seorang fotografer.'}
						</p>

						<div className="flex flex-col gap-6 mb-12">
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#705D00]/10 text-[#705D00]">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<span className="font-poppins text-base text-[#4D4732] leading-[1.6]">
									{service.duration_minutes} menit per session
								</span>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#705D00]/10 text-[#705D00]">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M9 22V12H15V22"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<span className="font-poppins text-base text-[#1A1C1C] leading-[1.6]">
									Bebas Foto Sepuasnya
								</span>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#705D00]/10 text-[#705D00]">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<span className="font-poppins text-base text-[#1A1C1C] leading-[1.6]">
									Max. 5 Orang (Hewan Peliharaan Boleh Ikut)
								</span>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#705D00]/10 text-[#705D00]">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.5972 21.9983 8.005 21.9983C6.4128 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00168 17.5872 2.00168 15.995C2.00168 14.4028 2.63416 12.8758 3.76 11.75L12.95 2.56C13.7005 1.80945 14.7184 1.38779 15.78 1.38779C16.8416 1.38779 17.8595 1.80945 18.61 2.56C19.3605 3.31054 19.7822 4.32843 19.7822 5.39C19.7822 6.45157 19.3605 7.46946 18.61 8.22L9.41 17.41C9.03474 17.7853 8.52572 17.9961 7.995 17.9961C7.46428 17.9961 6.95526 17.7853 6.58 17.41C6.20474 17.0347 5.9939 16.5257 5.9939 15.995C5.9939 15.4643 6.20474 14.9553 6.58 14.58L14.89 6.27"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
								<span className="font-poppins text-base text-[#1A1C1C] leading-[1.6]">
									Semua File Foto Dikirim via Google Drive
								</span>
							</div>
						</div>

						<div className="bg-[#FFD700]/50 rounded-[20px] p-8 mb-10">
							<span className="font-poppins font-semibold text-xs tracking-[0.1em] text-[#534602] uppercase block mb-2">
								Pilihan Paket Harga
							</span>
							<h3 className="font-poppins font-bold text-2xl text-[#000000] mb-2">
								{formattedPrice}
							</h3>
							<p className="font-poppins text-base text-[#1A1C1C] leading-[1.6]">
								Nikmati pengalamannya, bayar sesuai yang kamu rasakan.
							</p>
						</div>

						<Link
							href={`/booking?service=${getServiceSlug(service.service_name)}`}
							className="inline-flex w-full sm:w-[250px] h-[61px] bg-[#705D00] text-white font-poppins font-bold text-[18px] rounded-[20px] items-center justify-center hover:bg-[#5A4B00] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
							Amankan Jadwalmu
						</Link>
					</div>

					{/* Right: Image */}
					<div className="relative w-full h-[400px] lg:h-[704px] rounded-[40px] overflow-hidden shadow-xl order-1 lg:order-2">
						{service.thumbnail_url ? (
							<Image
								src={service.thumbnail_url}
								alt={service.service_name}
								fill
								className="object-cover"
								priority
							/>
						) : (
							<div className="w-full h-full bg-[#F0EFF4] flex items-center justify-center">
								<svg
									className="text-[#8E8777]/40"
									width="120"
									height="120"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
