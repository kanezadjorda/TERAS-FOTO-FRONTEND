import Link from 'next/link';

export function Footer() {
	return (
		<footer className="w-full bg-[#E2E2E2] pt-20 pb-12 flex justify-center mt-10">
			{/* Container dengan batas maksimal 1440px */}
			<div className="w-full max-w-[1440px] px-4 sm:px-8 md:px-16 lg:px-[189px]">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
					{/* Brand Column */}
					<div className="lg:col-span-1">
						<h3 className="font-poppins font-bold text-2xl text-[#705D00] mb-4">
							Teras Foto Studio
						</h3>
						<p className="font-poppins text-sm md:text-base text-[#4D4732] leading-[1.5] max-w-[270px]">
							Capturing the warmth of your everyday stories in the heart of the city.
						</p>
					</div>

					{/* Studio Column */}
					<div className="text-sm md:text-lg">
						<h4 className="font-poppins font-bold  text-[#1A1C1C] mb-4">Studio</h4>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="font-poppins  text-[#4D4732] hover:text-[#705D00] transition-colors">
									About Studio
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="font-poppins  text-[#4D4732] hover:text-[#705D00] transition-colors">
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="/careers"
									className="font-poppins  text-[#4D4732] hover:text-[#705D00] transition-colors">
									Careers
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal Column */}
					<div>
						<h4 className="font-poppins font-bold text-sm md:text-lg text-[#1A1C1C] mb-4">Legal</h4>
						<ul className="space-y-3">
							<li>
								<Link
									href="/privacy"
									className="font-poppins  text-[#4D4732] hover:text-[#705D00] transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="font-poppins  text-[#4D4732] hover:text-[#705D00] transition-colors">
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					{/* Connect Column */}
					<div>
						<h4 className="font-poppins font-bold text-sm md:text-lg text-[#1A1C1C] mb-4">
							Connect
						</h4>
						<div className="flex gap-4">
							{/* Instagram */}
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-full bg-[#EEEEEE] flex items-center justify-center hover:bg-slate-200 transition-colors"
								aria-label="Instagram">
								<svg
									width="17"
									height="17"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#1A1C1C"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round">
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
								</svg>
							</a>
							{/* TikTok */}
							<a
								href="https://tiktok.com"
								target="_blank"
								rel="noopener noreferrer"
								className="w-10 h-10 rounded-full bg-[#EEEEEE] flex items-center justify-center hover:bg-slate-200 transition-colors"
								aria-label="TikTok">
								<svg
									width="17"
									height="17"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#1A1C1C"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round">
									<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
								</svg>
							</a>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-[#4D4732]/10 pt-8 text-center">
					<p className="font-poppins text-base text-[#4D4732]/60">
						© 2024 Teras Foto Studio. Captured with warmth.
					</p>
				</div>
			</div>
		</footer>
	);
}
