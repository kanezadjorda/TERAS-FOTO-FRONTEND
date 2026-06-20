import Link from 'next/link';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';

const mockHistory = [
	{
		id: 1,
		session: 'Photobox',
		date: 'Oct 12, 2026',
		status: 'Completed',
	},
	{
		id: 2,
		session: 'Photobox',
		date: 'Nov 05, 2026',
		status: 'Confirmed',
	},
	{
		id: 3,
		session: 'Self Photo Studio',
		date: 'Oct 30, 2026',
		status: 'PAID',
	},
	{
		id: 4,
		session: 'Self Photo Studio',
		date: 'Sep 12, 2026',
		status: 'Pending',
	},
];

const getStatusStyle = (status) => {
	switch (status) {
		case 'Completed': return 'bg-[#DCFCE7] text-[#15803D]';
		case 'Confirmed': return 'bg-[#DBEAFE] text-[#1D4ED8]';
		case 'PAID': return 'bg-[#FEF9C3] text-[#166534]';
		case 'Pending': return 'bg-[#FFEDD5] text-[#C2410C]';
		default: return '';
	}
};

export function BookingHistoryPreview() {
	return (
		<div className="bg-[#F3F3F4] rounded-[20px] p-6 md:p-8 flex flex-col h-full">
			<div className="flex items-center justify-between mb-8">
				<h3 className="font-poppins font-semibold text-[20px] md:text-[24px] text-[#1A1C1C]">
					Booking History
				</h3>
				<Link href="/my-bookings" className="font-poppins font-semibold text-[14px] md:text-[16px] text-[#705D00] hover:underline flex items-center gap-1">
					View All <ChevronRight className="w-4 h-4" />
				</Link>
			</div>

			<div className="flex-1 overflow-x-auto">
				<table className="w-full min-w-[500px]">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left font-poppins font-semibold text-[12px] text-[#4D4732] tracking-[1.2px] uppercase pb-4">
								Sesi
							</th>
							<th className="text-left font-poppins font-semibold text-[12px] text-[#4D4732] tracking-[1.2px] uppercase pb-4">
								Tanggal
							</th>
							<th className="text-left font-poppins font-semibold text-[12px] text-[#4D4732] tracking-[1.2px] uppercase pb-4">
								Status
							</th>
							<th className="text-right font-poppins font-semibold text-[12px] text-[#4D4732] tracking-[1.2px] uppercase pb-4">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{mockHistory.map((item, index) => (
							<tr key={item.id} className={cn("group", index !== mockHistory.length - 1 && "border-b border-gray-200/50")}>
								<td className="py-4">
									<span className="font-poppins font-semibold text-[14px] md:text-[16px] text-[#1A1C1C]">
										{item.session}
									</span>
								</td>
								<td className="py-4">
									<span className="font-poppins font-regular text-[14px] md:text-[16px] text-[#4D4732]">
										{item.date}
									</span>
								</td>
								<td className="py-4">
									<span className={cn(
										"inline-flex items-center px-3 py-1 rounded-full font-poppins font-bold text-[10px] md:text-[12px] uppercase tracking-wider",
										getStatusStyle(item.status)
									)}>
										{item.status}
									</span>
								</td>
								<td className="py-4 text-right">
									<button aria-label="View options" className="p-2 hover:bg-gray-200 rounded-full transition-colors inline-flex items-center justify-center text-[#4D4732]">
										<MoreHorizontal className="w-5 h-5" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
