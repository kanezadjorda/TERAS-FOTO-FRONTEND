'use client';

export default function Error({ error, reset }) {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8 text-center">
			<h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi kesalahan!</h2>
			<p className="text-gray-600 mb-6">{error?.message || 'Gagal memuat halaman.'}</p>
			<button
				onClick={() => reset()}
				className="px-6 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-full hover:bg-yellow-500">
				Coba lagi
			</button>
		</div>
	);
}
