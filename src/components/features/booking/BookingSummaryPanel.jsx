'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';

export default function BookingSummaryPanel({
	selectedService,
	selectedDate,
	selectedTime,
	paymentType,
	setPaymentType,
	bookingError,
	bookingLoading,
	onBookingSubmit,
	onChangeService,
	localeID,
}) {
	return (
		<div className="bg-white rounded-[20px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] overflow-hidden flex flex-col h-full">
			{/* Image */}
			<div className="relative h-[256px] w-full bg-[#E2E2E2]">
				{selectedService.thumbnail_url ? (
					<Image
						src={selectedService.thumbnail_url}
						alt={selectedService.service_name}
						fill
						className="object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-[#8E8777]/40">
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				)}
			</div>

			<div className="p-6 flex flex-col flex-grow">
				{/* Service Info */}
				<div className="mb-6">
					<div className="flex justify-between items-start mb-2">
						<h3 className="font-poppins font-semibold text-2xl text-[#1A1C1C]">
							{selectedService.service_name}
						</h3>
						<button
							type="button"
							onClick={onChangeService}
							className="text-xs font-poppins font-semibold text-[#705D00] uppercase tracking-widest hover:underline cursor-pointer">
							Ganti
						</button>
					</div>

					<div className="space-y-2 mt-4">
						<div className="flex items-center gap-3">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 7H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
									stroke="#705D00"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="font-poppins font-semibold text-base text-[#1A1C1C]">
								{format(selectedDate, 'EEEE, MMM d, yyyy', { locale: localeID })}
							</span>
						</div>
						<div className="flex items-center gap-3">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
									stroke="#705D00"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="font-poppins text-sm text-[#4D4732]">
								{selectedTime
									? `${selectedTime} - ${format(new Date(new Date().setHours(...selectedTime.split(':'))).getTime() + selectedService.duration_minutes * 60000, 'HH:mm')}`
									: 'Pilih waktu sesi'}
							</span>
						</div>
						<div className="flex items-start gap-3">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="mt-0.5">
								<path
									d="M17.6569 16.6569C16.7202 17.5935 14.7681 19.5457 12.7324 21.5815C12.3506 21.9633 11.6494 21.9633 11.2676 21.5815C9.23192 19.5457 7.27984 17.5935 6.34315 16.6569C3.21895 13.5327 3.21895 8.46734 6.34315 5.34315C9.46734 2.21895 14.5327 2.21895 17.6569 5.34315C20.781 8.46734 20.781 13.5327 17.6569 16.6569Z"
									stroke="#705D00"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z"
									stroke="#705D00"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="font-poppins text-sm text-[#4D4732]">
								Jl.Serang, Cikande, Kec. Cikande, Kabupaten Serang
							</span>
						</div>
					</div>
				</div>

				{/* Payment Options */}
				<div className="mb-6">
					<h4 className="font-poppins font-semibold text-lg text-[#1A1C1C] mb-3">
						Pilihan paket
					</h4>
					<div className="space-y-3">
						{/* DP Option */}
						<div
							onClick={() => setPaymentType('dp')}
							className={`p-4 rounded-[20px] border-2 cursor-pointer transition-all flex items-center justify-between ${
								paymentType === 'dp'
									? 'border-[#705D00] bg-white'
									: 'border-[#F1EEE6] bg-[#F3F3F4]'
							}`}>
							<div className="flex items-center gap-3">
								<div
									className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
										paymentType === 'dp' ? 'border-[#705D00]' : 'border-[#B0ACA0]'
									}`}>
									{paymentType === 'dp' && (
										<div className="w-2.5 h-2.5 rounded-full bg-[#705D00]"></div>
									)}
								</div>
								<div>
									<p className="font-poppins font-semibold text-sm text-[#1A1C1C]">
										Bayar Sesuai Kepuasan Kamu
									</p>
									<p className="font-poppins text-xs text-[#4D4732]">
										Pastikan jadwal kamu tersedia
									</p>
								</div>
							</div>
							<span className="font-poppins font-semibold text-lg text-[#705D00]">
								Rp {(parseInt(selectedService.price) / 2).toLocaleString('id-ID')}
							</span>
						</div>

						{/* Full Option */}
						<div
							onClick={() => setPaymentType('full')}
							className={`p-4 rounded-[20px] border-2 cursor-pointer transition-all flex items-center justify-between ${
								paymentType === 'full'
									? 'border-[#705D00] bg-white'
									: 'border-[#F1EEE6] bg-[#F3F3F4]'
							}`}>
							<div className="flex items-center gap-3">
								<div
									className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
										paymentType === 'full' ? 'border-[#705D00]' : 'border-[#B0ACA0]'
									}`}>
									{paymentType === 'full' && (
										<div className="w-2.5 h-2.5 rounded-full bg-[#705D00]"></div>
									)}
								</div>
								<div>
									<p className="font-poppins font-semibold text-sm text-[#1A1C1C]">
										Pembayaran Penuh
									</p>
									<p className="font-poppins text-xs text-[#4D4732]">Opsi bayar lunas</p>
								</div>
							</div>
							<span className="font-poppins font-semibold text-lg text-[#1A1C1C]">
								Rp {parseInt(selectedService.price).toLocaleString('id-ID')}
							</span>
						</div>
					</div>
				</div>

				{/* Total & Submit */}
				<div className="mt-auto pt-6 border-t border-[#000000]/55">
					<div className="flex justify-between items-center mb-2">
						<span className="font-poppins text-base text-[#4D4732]">Harga Paket</span>
						<span className="font-poppins text-base text-[#4D4732]">
							Rp {parseInt(selectedService.price).toLocaleString('id-ID')}
						</span>
					</div>
					<div className="flex justify-between items-center mb-6">
						<span className="font-poppins font-semibold text-lg text-[#1A1C1C]">
							Total Bayar
						</span>
						<span className="font-poppins font-semibold text-2xl text-[#705E00]">
							Rp{' '}
							{(paymentType === 'dp'
								? parseInt(selectedService.price) / 2
								: parseInt(selectedService.price)
							).toLocaleString('id-ID')}
						</span>
					</div>

					{bookingError && (
						<div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-poppins">
							{bookingError}
						</div>
					)}

					<Button
						type="button"
						onClick={onBookingSubmit}
						disabled={bookingLoading || !selectedTime}
						className="w-full h-[60px] rounded-[20px] bg-[#FFD700] hover:bg-[#e6c200] text-[#1A1C1C] font-poppins font-bold text-xl border-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
						{bookingLoading ? (
							<>
								<div className="w-5 h-5 border-2 border-[#1A1C1C] border-t-transparent rounded-full animate-spin"></div>
								Memproses...
							</>
						) : (
							'Konfirmasi Pembayaran'
						)}
					</Button>
					<p className="text-center font-poppins text-xs text-[#4D4732] mt-4">
						By clicking submit, you agree to our Terms of Service & Cancellation Policy.
					</p>
				</div>
			</div>
		</div>
	);
}
