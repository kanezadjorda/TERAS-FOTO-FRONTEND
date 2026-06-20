'use client';

export default function TimeSlotSelector({
	timeSlots,
	selectedTime,
	onTimeSelect,
	isSlotDisabled,
}) {
	return (
		<div>
			<h3 className="font-poppins font-semibold text-2xl text-[#1A1C1C] mb-6">
				Pilih jam yang tersedia
			</h3>
			<div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
				{timeSlots.map(time => {
					const disabled = isSlotDisabled(time);
					const isSelected = selectedTime === time;

					return (
						<button
							key={time}
							type="button"
							disabled={disabled}
							onClick={() => onTimeSelect(time)}
							className={`h-[50px] rounded-[20px] font-poppins font-semibold text-base transition-all flex items-center justify-center ${
								disabled
									? 'bg-[#B0ACA0] text-white/50 cursor-not-allowed'
									: isSelected
										? 'bg-[#705E00] text-white'
										: 'bg-[#F3F3F4] text-[#4D4732] hover:bg-[#E2E2E2]'
							}`}>
							{time}
						</button>
					);
				})}
			</div>
		</div>
	);
}
