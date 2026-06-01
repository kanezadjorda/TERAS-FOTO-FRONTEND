export default function BookingLoading() {
	return (
		<div className="min-h-screen bg-[#FCFAF6] py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-[1200px] mx-auto space-y-8">
				{/* Header Skeleton */}
				<div className="text-center space-y-4 animate-pulse">
					<div className="h-10 w-64 bg-slate-200 rounded-full mx-auto" />
					<div className="h-4 w-96 bg-slate-200 rounded-full mx-auto" />
				</div>

				{/* Main Widget Skeleton */}
				<div className="w-full bg-white rounded-[30px] border border-[#F1EEE6] shadow-sm overflow-hidden">
					<div className="grid grid-cols-1 lg:grid-cols-12">
						{/* Left Side: Services (5 Cols) */}
						<div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#F1EEE6] space-y-6">
							{/* Step Title */}
							<div className="flex items-center gap-2 animate-pulse">
								<div className="w-7 h-7 rounded-full bg-slate-200" />
								<div className="h-6 w-32 bg-slate-200 rounded-full" />
							</div>

							{/* Service Cards Skeletons */}
							<div className="space-y-4">
								{[1, 2, 3].map(i => (
									<div
										key={i}
										className="p-5 rounded-[20px] border-2 border-[#F1EEE6] space-y-4 animate-pulse">
										<div className="flex justify-between items-start">
											<div className="h-5 w-40 bg-slate-200 rounded-full" />
										</div>
										<div className="space-y-2">
											<div className="h-3 w-full bg-slate-200 rounded-full" />
											<div className="h-3 w-5/6 bg-slate-200 rounded-full" />
										</div>
										<div className="flex justify-between items-center border-t border-[#F1EEE6] pt-3">
											<div className="h-4 w-24 bg-slate-200 rounded-full" />
											<div className="h-5 w-16 bg-slate-200 rounded-full" />
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Right Side: Date & Time (7 Cols) */}
						<div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between min-h-[500px] space-y-8">
							{/* Step 2: Date Picker Skeleton */}
							<div className="space-y-6">
								<div className="flex items-center gap-2 animate-pulse">
									<div className="w-7 h-7 rounded-full bg-slate-200" />
									<div className="h-6 w-32 bg-slate-200 rounded-full" />
								</div>

								{/* Horizontal Date Picker Skeleton */}
								<div className="flex gap-3 overflow-x-auto pb-2">
									{[1, 2, 3, 4, 5, 6, 7].map(i => (
										<div
											key={i}
											className="flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-[20px] border-2 border-[#F1EEE6] space-y-2 animate-pulse">
											<div className="h-2.5 w-8 bg-slate-200 rounded-full" />
											<div className="h-5 w-6 bg-slate-200 rounded-full" />
											<div className="h-2 w-8 bg-slate-200 rounded-full" />
										</div>
									))}
								</div>
							</div>

							{/* Step 3: Time Slots Skeleton */}
							<div className="space-y-6">
								<div className="flex items-center gap-2 animate-pulse">
									<div className="w-7 h-7 rounded-full bg-slate-200" />
									<div className="h-6 w-32 bg-slate-200 rounded-full" />
								</div>

								{/* Time Slots Grid Skeleton */}
								<div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
									{[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
										<div
											key={i}
											className="h-11 rounded-[15px] border-2 border-[#F1EEE6] animate-pulse bg-slate-50"
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
