'use client';

import { format, isSameDay, isBefore, startOfDay } from 'date-fns';

export default function CalendarGrid({
	currentMonth,
	selectedDate,
	onDateSelect,
	startingDayIndex,
	daysInMonth,
	localeID,
}) {
	return (
		<div className="grid grid-cols-7 gap-y-4 mb-4">
			{/* Day Names */}
			{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
				<div
					key={day}
					className="text-center font-poppins font-semibold text-base text-[#4D4732] tracking-[0.075em]">
					{day}
				</div>
			))}

			{/* Empty cells for days before start of month */}
			{Array.from({ length: startingDayIndex }).map((_, index) => (
				<div key={`empty-${index}`} className="h-12"></div>
			))}

			{/* Days */}
			{daysInMonth.map(day => {
				const isSelected = isSameDay(selectedDate, day);
				const isPast = isBefore(startOfDay(day), startOfDay(new Date()));

				return (
					<div key={day.toString()} className="flex justify-center">
						<button
							type="button"
							onClick={() => {
								if (!isPast) {
									onDateSelect(day);
								}
							}}
							disabled={isPast}
							className={`w-12 h-12 rounded-full flex items-center justify-center font-poppins font-semibold text-xl transition-all ${
								isSelected
									? 'bg-[#705D00] text-white'
									: isPast
										? 'text-[#D8D6CF] cursor-not-allowed'
										: 'text-[#4D4732] hover:bg-[#F1EEE6]'
							}`}>
							{format(day, 'd')}
						</button>
					</div>
				);
			})}
		</div>
	);
}
