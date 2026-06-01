import { Suspense } from 'react';
import BookingWidget from '@/components/features/booking/BookingWidget';

export const metadata = {
	title: 'Pilih Jadwal Foto Kamu - Teras Foto Studio',
	description: 'Pilih layanan, tanggal, dan waktu sesi foto terbaikmu di Teras Foto Studio.',
};

export default function BookingPage() {
	return (
		<main className="w-full min-h-screen bg-[#FEFEFF] pt-20 lg:pt-30 pb-12 sm:pb-20 flex justify-center">
			<div className="w-full max-w-[1440px] px-4 sm:px-8 md:px-16 lg:px-[118px]">
				{/* Header Title */}
				<div className="text-left mb-12 sm:mb-16">
					<h1 className="font-poppins font-bold text-3xl sm:text-4xl md:text-[48px] text-[#1A1C1C] leading-[1.1] mb-4">
						Booking Sesi Foto
					</h1>
					<p className="font-poppins text-base sm:text-lg text-[#4D4732] leading-[1.55] max-w-[600px]">
						Capture your golden moments in our sun-drenched studio space.
					</p>
				</div>

				{/* Booking Widget wrapped in Suspense because it uses useSearchParams() */}
				<Suspense
					fallback={
						<div className="w-full max-w-4xl mx-auto bg-white rounded-[30px] border border-[#F1EEE6] shadow-sm p-6 sm:p-8 animate-pulse">
							<div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
							<div className="space-y-4">
								<div className="h-12 bg-gray-200 rounded-xl w-full"></div>
								<div className="h-12 bg-gray-200 rounded-xl w-full"></div>
								<div className="h-32 bg-gray-200 rounded-xl w-full"></div>
							</div>
							<div className="mt-8 flex justify-end">
								<div className="h-12 bg-gray-200 rounded-[20px] w-32"></div>
							</div>
						</div>
					}>
					<BookingWidget />
				</Suspense>
			</div>
		</main>
	);
}
