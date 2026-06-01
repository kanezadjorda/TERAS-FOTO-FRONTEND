import { Greeting } from '@/components/features/dashboard/Greeting';
import { UpcomingSession } from '@/components/features/dashboard/UpcomingSession';
import { MembershipCard } from '@/components/features/dashboard/MembershipCard';
import { BookingHistoryPreview } from '@/components/features/dashboard/BookingHistoryPreview';
import { RecentPhotos } from '@/components/features/dashboard/RecentPhotos';
import Link from 'next/link';

export const metadata = {
	title: 'User Dashboard | Teras Foto Studio',
	description: 'Manage your upcoming and past photography sessions.',
};

export default function DashboardPage() {
	return (
		<div className="w-full h-full flex flex-col overflow-x-hidden max-w-full mx-auto">
			<Greeting />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
				{/* Top Left: Upcoming Session */}
				<div className="lg:col-span-8">
					<UpcomingSession />
				</div>

				{/* Top Right: Membership */}
				<div className="lg:col-span-4">
					<MembershipCard />
				</div>

				{/* Bottom Left: Booking History */}
				<div className="lg:col-span-8">
					<BookingHistoryPreview />
				</div>

				{/* Bottom Right: Recent Photos */}
				<div className="lg:col-span-4">
					<RecentPhotos />
				</div>
			</div>
		</div>
	);
}
