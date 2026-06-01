import Image from 'next/image';
import Link from 'next/link';

export function ServicesSection() {
	return (
		<section className="w-full py-24 bg-white flex justify-center">
			{/* Container dengan batas maksimal 1440px */}
			<div className="w-full max-w-[1440px] px-4 sm:px-8 md:px-16 lg:px-[118px]">
				{/* Section Header */}
				<div className="mb-16">
					<h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-[48px] text-[#1C1B1B] leading-[1.1] mb-4">
						Layanan Lainnya
					</h2>
					<p className="font-poppins text-base sm:text-lg text-[#4E4633] leading-[1.55] max-w-[845px]">
						Setiap sesi dibuat senyaman dan sefleksibel mungkin buat nemenin ide kreatifmu. Mau foto
						santai, bikin konten, sampai produksi yang lebih serius, semuanya bisa disesuaikan
						sesuai kebutuhan.
					</p>
				</div>

				{/* Service Cards Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
					{/* Card 1: Self Photo */}
					<div className="relative flex flex-col flex-col-reverse md:flex-row bg-white border border-[#E7E8EB] rounded-[20px] shadow-md overflow-hidden max-w-[1320px] min-h-100">
						{/* Left Content */}
						<div className="flex-1 p-8 lg:p-16 flex flex-col justify-between z-10">
							<div>
								{/* Popular Badge */}
								<div className="inline-flex items-center justify-center px-3 py-1 bg-[#705D00] rounded-full mb-6">
									<span className="font-inter font-bold text-[10px] text-white tracking-[-5%] uppercase">
										POPULAR
									</span>
								</div>

								<h3 className="font-poppins font-semibold text-2xl sm:text-[24px] text-[#1A1C1C] leading-[1.4] mb-4">
									Self Photo
								</h3>

								<p className="font-poppins text-sm sm:text-base text-[#4D4732] leading-[1.5] text-justify max-w-[379px]">
									Nikmati pengalaman foto yang nyaman, private, dan lebih leluasa untuk
									mengekspresikan diri. Kami menyiapkan studio dengan suasana yang mendukung agar
									setiap momen terasa lebih maksimal.
								</p>
							</div>

							<div className="mt-8">
								<div className="font-poppins font-semibold text-2xl sm:text-[24px] text-[#1A1C1C] leading-[1.4] mb-4">
									Rp. 50.000
								</div>
								<Link
									href="/booking?service=self-photo"
									className="inline-flex items-center justify-center w-full max-w-[379px] h-[48px] border border-[#6C5E1B] text-[#6C5E1B] font-inter font-bold text-base rounded-[50px] hover:bg-[#6C5E1B]/5 transition-colors">
									View Details
								</Link>
							</div>
						</div>

						{/* Right Image */}
						<div className="relative w-full md:w-[50%] lg:w-[55%] h-[300px] md:h-auto">
							<Image
								src="/images/self-photo-65a999.png"
								alt="Self Photo Studio"
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="object-cover"
							/>
						</div>
					</div>

					{/* Card 2: Maternity */}
					<div className="relative flex flex-col flex-col-reverse md:flex-row bg-[#E3E3E3] border border-[#E7E8EB] rounded-[20px] shadow-md overflow-hidden max-w-[1320px] min-h-100">
						{/* Left Content */}
						<div className="flex-1 p-8 sm:p-16 flex flex-col justify-between z-10">
							<div>
								{/* Spacer to align with Card 1 */}
								<div className="h-8 md:mb-6" />

								<h3 className="font-poppins font-semibold text-2xl sm:text-[24px] text-[#1A1C1C] leading-[1.4] mb-4">
									Maternity
								</h3>

								<p className="font-poppins text-sm sm:text-base text-[#4D4732] leading-[1.5] text-justify max-w-[368px]">
									Abadikan momen kehamilan dengan suasana yang nyaman, hangat, dan private. Dibuat
									agar setiap sesi terasa lebih tenang dan penuh kesan.
								</p>
							</div>

							<div className=" mt-5 md:mt-8">
								<div className="font-poppins font-semibold text-2xl sm:text-[24px] text-[#1A1C1C] leading-[1.4] mb-4">
									Rp. 50.000
								</div>
								<Link
									href="/booking?service=maternity"
									className="inline-flex items-center justify-center w-full max-w-[379px] h-[48px] border border-[#6C5E1B] text-[#6C5E1B] font-inter font-bold text-base rounded-[50px] hover:bg-[#6C5E1B]/5 transition-colors">
									View Details
								</Link>
							</div>
						</div>

						{/* Right Image */}
						<div className="relative w-full md:w-[50%] lg:w-[55%] h-[300px] md:h-auto">
							<Image
								src="/images/maternity.png"
								alt="Maternity Photo Session"
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>

				{/* See More Button */}
				<div className="mt-16 flex justify-center lg:justify-end">
					<Link
						href="/catalog"
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#FEFEFF] border border-[#E5E2DC] rounded-[31px] text-[#745B00] font-poppins font-medium text-base hover:bg-slate-50 transition-colors shadow-sm">
						<span>Lihat Selengkapnya</span>
						<svg
							width="10"
							height="10"
							viewBox="0 0 10 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M1 9L9 1M9 1H3M9 1V9"
								stroke="#745B00"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</Link>
				</div>
			</div>
		</section>
	);
}
