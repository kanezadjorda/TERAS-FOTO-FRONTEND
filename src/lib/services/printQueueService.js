import { api } from '@/lib/api';

export const getPrintQueues = async (options = {}) => {
	return api.get('/print-queues', options);
};

export const updatePrintQueueStatus = async (queueId, payload, options = {}) => {
	return api.put(`/print-queues/${queueId}/status`, payload, options);
};
