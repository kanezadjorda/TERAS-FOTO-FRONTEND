'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { Printer, CheckCircle, Clock, User, Package, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

const fetcher = url => api.get(url).then(res => res.data);

export default function PrintQueuePage() {
	const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

	const {
		data: queues,
		error,
		isLoading,
		mutate,
	} = useSWR(`/print-queues?date=${selectedDate}`, fetcher);

	const handleUpdateStatus = async (queueId, newStatus) => {
		try {
			await api.put(`/print-queues/${queueId}/status`, { queue_status: newStatus });
			mutate(); // Refresh data
		} catch (error) {
			console.error('Failed to update print queue status:', error);
			alert('Gagal memperbarui status antrean cetak');
		}
	};

	if (isLoading) {
		return (
			<div className="p-8 flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8">
				<div className="bg-red-50 text-red-600 p-4 rounded-lg">
					Gagal memuat data antrean cetak. Silakan coba lagi.
				</div>
			</div>
		);
	}

	// Filter data based on status
	const waitingQueues = queues?.filter(q => q.queue_status === 'waiting') || [];
	const printingQueues = queues?.filter(q => q.queue_status === 'printing') || [];
	const doneQueues = queues?.filter(q => q.queue_status === 'done') || [];

	return (
		<div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
			<div className="mb-8 flex-shrink-0 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Antrean Cetak</h1>
					<p className="text-gray-500 mt-1">
						Kelola proses pencetakan foto pelanggan (Kanban Board)
					</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="date"
							value={selectedDate}
							onChange={e => setSelectedDate(e.target.value)}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
						/>
					</div>
				</div>
			</div>

			<div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
				{/* Column: Waiting */}
				<div className="flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
					<div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Clock className="w-5 h-5 text-yellow-500" />
							<h2 className="font-semibold text-gray-900">Menunggu Dicetak</h2>
						</div>
						<span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm font-medium">
							{waitingQueues.length}
						</span>
					</div>
					<div className="p-4 flex-1 overflow-y-auto space-y-4">
						{waitingQueues.map(queue => (
							<PrintCard
								key={queue.id}
								queue={queue}
								actionLabel="Mulai Cetak"
								actionIcon={Printer}
								actionColor="bg-blue-600 hover:bg-blue-700"
								onAction={() => handleUpdateStatus(queue.id, 'printing')}
							/>
						))}
						{waitingQueues.length === 0 && (
							<div className="text-center py-8 text-gray-400 text-sm">Tidak ada antrean</div>
						)}
					</div>
				</div>

				{/* Column: Printing */}
				<div className="flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
					<div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Printer className="w-5 h-5 text-blue-500" />
							<h2 className="font-semibold text-gray-900">Sedang Dicetak</h2>
						</div>
						<span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm font-medium">
							{printingQueues.length}
						</span>
					</div>
					<div className="p-4 flex-1 overflow-y-auto space-y-4">
						{printingQueues.map(queue => (
							<PrintCard
								key={queue.id}
								queue={queue}
								actionLabel="Selesai"
								actionIcon={CheckCircle}
								actionColor="bg-green-600 hover:bg-green-700"
								onAction={() => handleUpdateStatus(queue.id, 'done')}
							/>
						))}
						{printingQueues.length === 0 && (
							<div className="text-center py-8 text-gray-400 text-sm">Tidak ada proses cetak</div>
						)}
					</div>
				</div>

				{/* Column: Done */}
				<div className="flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
					<div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
						<div className="flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-500" />
							<h2 className="font-semibold text-gray-900">Selesai</h2>
						</div>
						<span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm font-medium">
							{doneQueues.length}
						</span>
					</div>
					<div className="p-4 flex-1 overflow-y-auto space-y-4">
						{doneQueues.map(queue => (
							<PrintCard key={queue.id} queue={queue} isDone />
						))}
						{doneQueues.length === 0 && (
							<div className="text-center py-8 text-gray-400 text-sm">Belum ada yang selesai</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function PrintCard({ queue, actionLabel, actionIcon: ActionIcon, actionColor, onAction, isDone }) {
	const { booking } = queue;

	return (
		<div
			className={cn(
				'bg-white p-4 rounded-lg border shadow-sm',
				isDone ? 'border-green-200 opacity-75' : 'border-gray-200',
			)}>
			<div className="flex justify-between items-start mb-3">
				<h3 className="font-semibold text-gray-900">{booking?.booking_code}</h3>
			</div>

			<div className="space-y-2 mb-4">
				<div className="flex items-center gap-2 text-gray-700 text-sm">
					<User className="w-4 h-4 text-gray-400" />
					<span className="font-medium">{booking?.user?.full_name || 'Unknown User'}</span>
				</div>
				<div className="flex items-center gap-2 text-gray-600 text-sm">
					<Package className="w-4 h-4 text-gray-400" />
					<span>{booking?.service?.service_name || 'Unknown Service'}</span>
				</div>
			</div>

			{!isDone && onAction && (
				<button
					onClick={onAction}
					className={cn(
						'w-full flex items-center justify-center gap-2 py-2 text-white rounded-md transition-colors text-sm font-medium',
						actionColor,
					)}>
					{ActionIcon && <ActionIcon className="w-4 h-4" />}
					{actionLabel}
				</button>
			)}
		</div>
	);
}
