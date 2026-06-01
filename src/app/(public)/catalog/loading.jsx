export default function CatalogLoading() {
	return (
		<div className="w-full min-h-screen bg-white py-24 flex justify-center">
			<div className="w-full max-w-[1440px] px-4 sm:px-8 md:px-16 lg:px-[118px]">
				{/* Header Skeleton */}
				<div className="mb-12 animate-pulse">
					<div className="h-12 w-64 bg-slate-200 rounded-lg mb-4" />
					<div className="h-6 w-full max-w-[600px] bg-slate-200 rounded-lg mb-2" />
					<div className="h-6 w-3/4 max-w-[400px] bg-slate-200 rounded-lg" />
				</div>

				{/* Search & Filter Controls Skeleton */}
				<div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center animate-pulse">
					<div className="w-full md:w-96 h-12 bg-slate-200 rounded-full" />
					<div className="flex gap-3 w-full md:w-auto">
						<div className="flex-1 md:w-40 h-12 bg-slate-200 rounded-full" />
						<div className="flex-1 md:w-40 h-12 bg-slate-200 rounded-full" />
					</div>
				</div>

				{/* Grid Cards Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{[1, 2, 3, 4].map(item => (
						<div
							key={item}
							className="border border-slate-100 rounded-[20px] overflow-hidden shadow-sm bg-white flex flex-col h-[480px] animate-pulse">
							{/* Image Skeleton */}
							<div className="relative w-full h-56 bg-slate-200" />

							{/* Content Skeleton */}
							<div className="p-6 flex-1 flex flex-col justify-between">
								<div>
									<div className="flex justify-between items-start mb-4">
										<div className="h-7 w-2/3 bg-slate-200 rounded-lg" />
										<div className="h-6 w-16 bg-slate-200 rounded-full" />
									</div>
									<div className="space-y-2">
										<div className="h-4 w-full bg-slate-200 rounded" />
										<div className="h-4 w-5/6 bg-slate-200 rounded" />
										<div className="h-4 w-4/5 bg-slate-200 rounded" />
									</div>
								</div>

								<div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
									<div className="h-8 w-28 bg-slate-200 rounded-lg" />
									<div className="h-11 w-32 bg-slate-200 rounded-full" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
