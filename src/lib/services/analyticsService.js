import { api } from '@/lib/api';

export const getDashboardStats = async (options = {}) => {
	return api.get('/admin/dashboard/stats', options);
};

export const getRecentBookings = async (options = {}) => {
	return api.get('/admin/dashboard/recent-bookings', options);
};

export const getWeeklyFlow = async (options = {}) => {
	return api.get('/admin/dashboard/weekly-flow', options);
};

export const getRevenueTrend = async (year, options = {}) => {
	const params = year ? `?year=${year}` : '';
	return api.get(`/admin/analytics/revenue-trend${params}`, options);
};

export const getBookingShare = async (options = {}) => {
	return api.get('/admin/analytics/booking-share', options);
};

export const getTopPackages = async (options = {}) => {
	return api.get('/admin/analytics/top-packages', options);
};

export const getPeakHours = async (options = {}) => {
	return api.get('/admin/analytics/peak-hours', options);
};

export const getAnalytics = async (options = {}) => {
	return api.get('/admin/analytics', options);
};
