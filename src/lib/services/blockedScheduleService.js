import { api } from '@/lib/api';

export const getAllBlockedSchedules = async (options = {}) => {
	return api.get('/blocked-schedules', options);
};

export const getAdminBlockedSchedules = async (options = {}) => {
	return api.get('/admin/blocked-schedules', options);
};

export const createBlockedSchedule = async (payload, options = {}) => {
	return api.post('/admin/blocked-schedules', payload, options);
};

export const deleteBlockedSchedule = async (id, options = {}) => {
	return api.delete(`/admin/blocked-schedules/${id}`, options);
};
