export default function MyBookingsLoading() {
	return (
		<div className="w-full">
			{/* Header Title Skeleton */}
			<div className="mb-8 animate-pulse">
				<div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
				<div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
				<div className="h-4 bg-gray-200 rounded-lg w-1/2 mt-2"></div>
			</div>

			{/* Bookings List Skeleton */}
			<div className="w-full space-y-6">
				{[1, 2, 3].map(i => (
					<div
						key={i}
						className="bg-white rounded-[30px] border border-[#F1EEE6] shadow-sm p-6 sm:p-8 animate-pulse">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
							<div className="space-y-2 w-full sm:w-1/2">
								<div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
								<div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
							</div>
							<div className="h-8 bg-gray-200 rounded-full w-24"></div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
								<div className="h-5 bg-gray-200 rounded-md w-2/3"></div>
							</div>
							<div className="space-y-2">
								<div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
								<div className="h-5 bg-gray-200 rounded-md w-2/3"></div>
							</div>
						</div>
						<div className="flex justify-end gap-3 pt-6 border-t border-[#F1EEE6]">
							<div className="h-10 bg-gray-200 rounded-[20px] w-28"></div>
							<div className="h-10 bg-gray-200 rounded-[20px] w-32"></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
