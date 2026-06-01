import { api } from '@/lib/api';

export const getMyBookingHistory = async (options = {}) => {
	return api.get('/bookings/my-history', options);
};

export const getAvailability = async (startDate, endDate, roomId, options = {}) => {
	const params = new URLSearchParams({
		start_date: startDate,
		end_date: endDate,
		room_id: roomId,
	}).toString();

	return api.get(`/bookings/availability?${params}`, options);
};

export const createBooking = async (payload, options = {}) => {
	return api.post('/bookings', payload, options);
};

export const requestReschedule = async (bookingId, payload, options = {}) => {
	return api.post(`/bookings/${bookingId}/reschedule`, payload, options);
};

export const cancelBooking = async (bookingId, options = {}) => {
	return api.put(`/bookings/${bookingId}/cancel`, undefined, options);
};

export const getAllBookingsAdmin = async (params = {}, options = {}) => {
	const queryParams = new URLSearchParams();
	if (params.page) queryParams.append('page', params.page);
	if (params.limit) queryParams.append('limit', params.limit);
	if (params.search) queryParams.append('search', params.search);
	if (params.status) queryParams.append('status', params.status);
	if (params.service) queryParams.append('service', params.service);

	const queryString = queryParams.toString();
	return api.get(`/admin/bookings${queryString ? `?${queryString}` : ''}`, options);
};

export const getScheduleEvents = async (month, options = {}) => {
	const params = month ? `?month=${month}` : '';
	return api.get(`/admin/schedule/events${params}`, options);
};
