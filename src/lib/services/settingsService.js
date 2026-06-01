import { api } from '@/lib/api';

export const updateProfile = async (payload, options = {}) => {
	return api.put('/admin/settings/profile', payload, options);
};

export const updatePassword = async (payload, options = {}) => {
	return api.put('/admin/settings/password', payload, options);
};
