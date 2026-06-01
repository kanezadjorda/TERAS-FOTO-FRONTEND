export default function Loading() {
	return (
		<div className="w-full h-screen p-8 space-y-4 animate-pulse">
			<div className="h-12 bg-gray-200 rounded-md w-1/3"></div>
			<div className="h-64 bg-gray-200 rounded-md w-full"></div>
		</div>
	);
}
