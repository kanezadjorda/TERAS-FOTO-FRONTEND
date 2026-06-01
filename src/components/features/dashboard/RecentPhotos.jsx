import Link from 'next/link';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';

export function RecentPhotos() {
	return (
		<div className="bg-[#F3F3F4] rounded-[20px] p-6 md:p-8 flex flex-col h-full">
			<div className="flex items-center justify-between mb-6">
				<h3 className="font-poppins font-semibold text-[18px] text-[#1A1C1C]">
					Hasil foto terbaru
				</h3>
				<Link href="/gallery" className="font-poppins font-semibold text-[14px] md:text-[16px] text-[#705D00] hover:underline flex items-center gap-1">
					Access Gallery <ChevronRight className="w-4 h-4" />
				</Link>
			</div>

			<div className="grid grid-cols-2 gap-4 flex-1">
				{/* Placeholder for Photo 1 */}
				<div className="bg-white rounded-[20px] overflow-hidden relative shadow-sm aspect-[4/5] flex items-center justify-center group cursor-pointer hover:shadow-md transition-shadow">
					<div className="absolute inset-0 bg-[#E8E8E8] group-hover:bg-[#E0E0E0] transition-colors" />
					<ImageIcon className="w-10 h-10 text-[#4D4732]/30 relative z-10" />
				</div>
				
				{/* Placeholder for Photo 2 */}
				<div className="bg-white rounded-[20px] overflow-hidden relative shadow-sm aspect-[4/5] flex items-center justify-center group cursor-pointer hover:shadow-md transition-shadow">
					<div className="absolute inset-0 bg-[#E8E8E8] group-hover:bg-[#E0E0E0] transition-colors" />
					<ImageIcon className="w-10 h-10 text-[#4D4732]/30 relative z-10" />
				</div>
			</div>
		</div>
	);
}
