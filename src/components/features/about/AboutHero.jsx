import Image from 'next/image';

export default function AboutHero() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 md:py-28">
			{/* Background Decorative Elements */}
			<div className="absolute inset-0 -z-10 opacity-30">
				<div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#705D00]/10 blur-3xl" />
				<div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-[#705D00]/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
					{/* Teks Sejarah */}
					<div className="lg:col-span-6 space-y-6">
						<div className="inline-flex items-center gap-2 rounded-full bg-[#705D00]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#705D00]">
							<span className="h-1.5 w-1.5 rounded-full bg-[#705D00] animate-pulse" />
							Established 2018
						</div>

						<h1 className="text-4xl font-extrabold tracking-tight text-[#1A1C1C] sm:text-5xl md:text-6xl leading-none">
							Teras Foto <br />
							<span className="text-[#705D00]">Studio</span>
						</h1>

						<div className="h-1 w-20 bg-[#705D00] rounded-full" />

						<div className="mt-6 space-y-6 text-base md:text-lg leading-relaxed text-[#4D4732] text-justify font-light">
							<p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#705D00] first-letter:mr-3 first-letter:float-left">
								Teras Foto Studio merupakan usaha kreatif yang bergerak di bidang jasa fotografi dan
								videografi profesional. Didirikan pada tahun 2018 oleh Dimas Ardianto, studio ini
								awalnya berfokus pada layanan foto prewedding, wedding, dan wisuda. Seiring
								meningkatnya permintaan pasar, pada tahun 2020 Teras Foto Studio membuka studio
								permanen untuk umum dan memperluas layanannya.
							</p>
							<p>
								Saat ini, Teras Foto Studio menyediakan berbagai layanan fotografi, seperti foto
								keluarga, photobox, self photo, prewedding, wedding, event, dan wisuda. Nama Teras
								Foto Studio berasal dari kata{' '}
								<strong className="font-semibold text-[#1A1C1C]">Teras</strong> yang melambangkan
								ruang yang ramah, terbuka, dan menjadi tempat lahirnya ide kreatif, serta{' '}
								<strong className="font-semibold text-[#1A1C1C]">Foto Studio</strong> yang
								menegaskan bidang usahanya.
							</p>
							<p className="border-l-4 border-[#705D00] pl-4 italic text-[#705D00]/90 font-normal bg-[#705D00]/5 py-3 rounded-r-xl">
								Filosofi tersebut mencerminkan komitmen Teras Foto Studio dalam menyediakan layanan
								fotografi yang nyaman, profesional, dan berkualitas untuk mengabadikan setiap momen
								berharga pelanggan.
							</p>
						</div>
					</div>

					{/* Gambar Showcase */}
					<div className="relative lg:col-span-6 flex justify-center">
						<div className="relative w-full max-w-lg lg:max-w-none">
							{/* Decorative Frame */}
							<div className="absolute -inset-4 rounded-3xl border-2 border-dashed border-[#705D00]/30 -z-10 transform rotate-2 transition-transform duration-500 hover:rotate-0" />

							<div className=" p-4 overflow-hidden rounded-2xl hover:shadow-2xl hover:transform hover:-rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-[1.02]">
								<Image
									src="/images/logo-435822.png"
									alt="Teras Foto Studio Showcase"
									width={800}
									height={600}
									className="h-full w-full object-left"
									priority
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
