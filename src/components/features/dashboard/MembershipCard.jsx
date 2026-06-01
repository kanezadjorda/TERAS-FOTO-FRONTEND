import { Trophy, Star } from 'lucide-react';

export function MembershipCard() {
	return (
		<div className="bg-[#6C5E1B] rounded-[20px] p-8 text-white relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
			{/* Background Decoration */}
			<div className="absolute right-[-20px] top-[-20px] opacity-10">
				<Trophy className="w-48 h-48" />
			</div>

			<div className="relative z-10 flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<h3 className="font-poppins font-regular text-[20px]">Gold Membership</h3>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="font-poppins font-semibold text-[12px] text-white/80 tracking-[1.2px] uppercase mb-1">
							Total Sessions
						</div>
						<div className="font-poppins font-bold text-[36px] text-[#FFE766] leading-none tracking-[-0.36px]">
							12
						</div>
					</div>
					<div>
						<div className="font-poppins font-semibold text-[12px] text-white/80 tracking-[1.2px] uppercase mb-1">
							Points
						</div>
						<div className="font-poppins font-bold text-[36px] text-[#FFE766] leading-none tracking-[-0.36px]">
							180
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-4 mt-2">
					<p className="font-poppins font-regular text-[14px] text-white/80">
						You have 3 free prints left this month.
					</p>
					<button className="bg-[#FFE16D] hover:bg-[#F0D855] transition-colors text-[#221B00] font-poppins font-bold text-[14px] px-6 py-2.5 rounded-full w-max">
						Upgrade Plan
					</button>
				</div>
			</div>
		</div>
	);
}
