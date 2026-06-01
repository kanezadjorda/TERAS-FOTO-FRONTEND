import { Button } from '@/components/ui/Button';

export default function ContactInfo() {
	return (
		<section className="relative bg-white py-20 md:py-28 overflow-hidden">
			{/* Background Decorative Elements */}
			<div className="absolute inset-0 -z-10 opacity-30">
				<div className="absolute top-1/4 -right-40 h-96 w-96 rounded-full bg-[#705D00]/10 blur-3xl" />
				<div className="absolute bottom-1/4 -left-40 h-96 w-96 rounded-full bg-[#705D00]/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
					{/* Informasi Kontak (Kartu Kiri) */}
					<div className="lg:col-span-5 space-y-8">
						<div className="space-y-4">
							<span className="text-xs font-bold uppercase tracking-widest text-[#705D00] bg-[#705D00]/10 px-3 py-1 rounded-full">
								Get In Touch
							</span>
							<h2 className="text-3xl font-extrabold tracking-tight text-[#1A1C1C] sm:text-4xl">
								Hubungi Kami
							</h2>
							<div className="h-1 w-16 bg-[#705D00] rounded-full" />
							<p className="text-base leading-relaxed text-[#4D4732] font-light">
								Punya pertanyaan atau ingin memesan jadwal khusus? Jangan ragu untuk menghubungi
								kami atau langsung datang ke studio kami.
							</p>
						</div>

						{/* Contact Cards */}
						<div className="space-y-4">
							{/* Jam Operasional */}
							<div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#705D00]/20 hover:bg-white hover:shadow-md transition-all duration-300">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#705D00]/10 text-[#705D00]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="h-6 w-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-base font-bold text-[#1A1C1C]">Jam Operasional</h3>
									<p className="mt-1 text-sm text-[#4D4732] font-light">
										Senin - Minggu : 09:00 AM - 21:00 PM
									</p>
								</div>
							</div>

							{/* Lokasi */}
							<div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#705D00]/20 hover:bg-white hover:shadow-md transition-all duration-300">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#705D00]/10 text-[#705D00]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="h-6 w-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-base font-bold text-[#1A1C1C]">Lokasi</h3>
									<p className="mt-1 text-sm text-[#4D4732] leading-relaxed font-light">
										Jl.Serang, Cikande, Kec. Cikande, Kabupaten Serang, Banten 42186
									</p>
								</div>
							</div>

							{/* Informasi Kontak */}
							<div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#705D00]/20 hover:bg-white hover:shadow-md transition-all duration-300">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#705D00]/10 text-[#705D00]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="h-6 w-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-base font-bold text-[#1A1C1C]">Informasi</h3>
									<p className="mt-1 text-sm text-[#4D4732] font-light">
										terasfotostudiocikande@gmail.com
									</p>
									<p className="text-sm text-[#4D4732] font-light">+62 812 4607 8809</p>
								</div>
							</div>
						</div>

						{/* Tombol Aksi */}
						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<a
								href="https://wa.me/6281246078809"
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1">
								<Button
									variant="primary"
									size="lg"
									className="w-full bg-[#705D00] hover:bg-[#5c4b00] rounded-xl shadow-lg shadow-[#705D00]/20 py-6">
									Kunjungi studio
								</Button>
							</a>
							<a
								href="https://maps.google.com/?q=Teras+Foto+Studio+Cikande"
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1">
								<Button
									variant="outline"
									size="lg"
									className="w-full border-[#705D00] text-[#705D00] hover:bg-[#705D00]/5 rounded-xl py-6">
									Lihat di Google Maps
								</Button>
							</a>
						</div>
					</div>

					{/* Peta / Google Maps Embed (Kartu Kanan) */}
					<div className="lg:col-span-7 w-full relative group">
						{/* Decorative Frame */}
						<div className="absolute -inset-4 rounded-[2.5rem] border-2 border-dashed border-[#705D00]/20 -z-10 transform -rotate-1 transition-transform duration-500 group-hover:rotate-0" />

						<div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-2xl aspect-[16/15] w-full bg-slate-100 relative transform transition-all duration-500 group-hover:scale-[1.01]">
							{/* Google Maps Iframe */}
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.425782095792!2d106.35918107576437!3d-6.207434760806824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e42035f38d20af9%3A0xa79d54bac413e8a0!2sTERAS%20FOTO%20STUDIO%20%26%20PHOTOWORK!5e0!3m2!1sid!2sid!4v1780186698110!5m2!1sid!2sid"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen=""
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Lokasi Teras Foto Studio Cikande"
								className="absolute inset-0 w-full h-full"></iframe>

							{/* Floating Card Overlay (Figma Feature) */}
							<div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-slate-100 max-w-xs transform transition-all duration-500 group-hover:translate-y-[-4px] flex items-center gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#705D00] text-white">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="w-5 h-5">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
										/>
									</svg>
								</div>
								<div>
									<p className="text-sm font-bold text-[#705D00]">Teras Foto Studio</p>
									<p className="text-xs text-[#4D4732] font-light mt-0.5">
										Find us near the Art District
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
