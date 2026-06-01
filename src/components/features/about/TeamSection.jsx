import Image from 'next/image';

const teamMembers = [
	{
		name: 'Dimas Ardiyanto',
		role: 'Owner Teras foto studio',
		image: '/images/dimas.png',
		bio: 'Visi saya adalah menghadirkan ruang kreatif yang hangat dan ramah bagi semua orang untuk mengabadikan momen terbaik mereka.',
	},
	{
		name: 'Mahdi',
		role: 'LEAD PHOTOGRAPHER',
		image: '/images/mahdi-2.png',
		bio: 'Fokus pada pencahayaan alami dan menangkap emosi murni dalam setiap jepretan kamera.',
	},
	{
		name: 'Riyan',
		role: 'ADMIN TERAS FOTO STUDIO',
		image: '/images/riyan.png',
		bio: 'Siap membantu merencanakan sesi foto Anda dengan ramah, terstruktur, dan tanpa hambatan.',
	},
];

export default function TeamSection() {
	return (
		<section className="relative bg-white py-20 md:py-28 overflow-hidden">
			{/* Background Decorative Elements */}
			<div className="absolute inset-0 -z-10 opacity-40">
				<div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#705D00]/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="mx-auto max-w-3xl text-center space-y-4">
					<span className="text-xs font-bold uppercase tracking-widest text-[#705D00] bg-[#705D00]/10 px-3 py-1 rounded-full">
						Our Creative Minds
					</span>
					<h2 className="text-3xl font-extrabold tracking-tight text-[#1A1C1C] sm:text-4xl md:text-5xl">
						Tim Teras Foto Studio
					</h2>
					<div className="mx-auto h-1 w-16 bg-[#705D00] rounded-full" />
					<p className="mt-4 text-base md:text-lg leading-relaxed text-[#4D4732] font-light">
						A collective of visual storytellers, lighting enthusiasts, and chill vibes specialists
						dedicated to making you look your best.
					</p>
				</div>

				{/* Team Grid */}
				<div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{teamMembers.map(member => (
						<div
							key={member.name}
							className="group relative overflow-hidden  bg-white flex flex-col h-full">
							{/* Foto Profil Container */}
							<div className="relative size-89 md:size-96 ">
								<Image
									src={member.image}
									alt={member.name}
									fill
									className="object-cover object-top rounded-3xl"
								/>

								{/* Gradient Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 rounded-3xl">
									<p className="text-white text-sm font-light italic leading-relaxed">
										&ldquo;{member.bio}&rdquo;
									</p>
								</div>
							</div>

							{/* Detail Profil */}
							<div className="py-8 flex-grow flex flex-col justify-between relative">
								{/* Top Accent Line */}
								<div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#705D00] rounded-b-full opacity-0 group-hover:w-24 transition-all duration-500" />

								<div>
									<h3 className="text-2xl font-bold text-[#1A1C1C] transition-colors duration-300 group-hover:text-[#705D00]">
										{member.name}
									</h3>
									<p className="mt-2 text-xs font-bold uppercase text-[#705D00]">{member.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
