'use client';

import { useAuth } from '@/contexts/AuthContext';

export function Greeting() {
	const { user } = useAuth();
	const userName = user?.full_name || 'Guest';

	return (
		<div className="flex flex-col gap-2 mb-8">
			<h1 className="font-poppins font-bold text-[32px] md:text-[36px] text-[#1A1C1C] leading-tight tracking-[-0.36px]">
				Selamat Datang Kembali, {userName}
			</h1>
			<p className="font-poppins font-regular text-[16px] md:text-[18px] text-[#4D4732] leading-relaxed">
				Wujudkan foto impianmu di sesi selanjutnya
			</p>
		</div>
	);
}
