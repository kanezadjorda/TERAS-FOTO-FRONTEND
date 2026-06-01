import { api } from '@/lib/api';

export const updateBookingStatus = async (bookingId, payload, options = {}) => {
	return api.put(`/cashier/bookings/${bookingId}/status`, payload, options);
};

export const addBookingAddOn = async (bookingId, payload, options = {}) => {
	return api.post(`/cashier/bookings/${bookingId}/add-ons`, payload, options);
};

export const reviewReschedule = async (rescheduleId, payload, options = {}) => {
	return api.put(`/cashier/reschedules/${rescheduleId}/review`, payload, options);
};
