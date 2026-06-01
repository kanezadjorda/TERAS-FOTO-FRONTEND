import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
	return (
		<section className="relative  w-full h-screen bg-[linear-gradient(90deg,#F0EFF4_50%,#ECECF0_50%)] overflow-hidden flex justify-center">
			{/* Container dengan batas maksimal 1440px */}
			<div className="relative w-full max-w-[1920] h-full flex items-center px-4 sm:px-8 md:px-12">
				{/* Background Image di dalam container 1440px */}
				<div className="absolute inset-0 z-0">
					<Image
						src="/images/hero-bg-4.PNG"
						alt="Teras Foto Studio Hero Background"
						fill
						sizes="100vw"
						priority
						quality={95}
						className="object-center"
					/>
				</div>

				{/* Hero Content */}
				<div className=" z-10 w-160 md:w-200 lg:w-300 mt-25">
					<h1 className="font-epilogue font-bold text-5xl md:text-7xl lg:text-8xl text-[#1C1B1B] leading-[1.05] sm:leading-[0.97] tracking-[-2.5%]">
						Capture Every
						<br />
						Moments,
						<br />
						<span className="text-[#745B00] font-light italic">Create Memories</span>
					</h1>

					<p className="mt-6 font-poppins text-base sm:text-lg md:text-[20px] text-[#4E4633] leading-[1.4] max-w-153.25">
						Tingkatkan penceritaan visual Anda di ruang premium kami yang dirancang dengan cermat.
						Hasil profesional dengan suasana santai dan nyaman.
					</p>

					{/* Hero Actions */}
					<div className="mt-10 flex flex-wrap gap-4 sm:gap-6">
						<Link
							href="/booking"
							className="inline-flex items-center justify-center w-fit h-[50px] px-10 md:w-fit md:h-[60px] md:px-10 bg-[#FFD700] text-black font-poppins font-semibold text-base rounded-[31px] hover:bg-[#e6c200] transition-colors shadow-sm transition-all duration-300">
							Book Now
						</Link>
						<Link
							href="/catalog"
							className="inline-flex items-center justify-center w-fit h-[50px] px-10 md:w-fit md:h-[60px] md:px-10 bg-[#FEFEFF] border border-[#E5E2DC] text-[#745B00] font-poppins font-semibold text-lg rounded-[31px] hover:bg-slate-50 transition-colors shadow-sm">
							See Our Services
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
