import { api } from '@/lib/api';

export const getAllAddOns = async (options = {}) => {
	return api.get('/add-ons', options);
};

export const getAdminAddOns = async (options = {}) => {
	return api.get('/admin/add-ons', options);
};

export const createAddOn = async (payload, options = {}) => {
	return api.post('/admin/add-ons', payload, options);
};

export const updateAddOn = async (addOnId, payload, options = {}) => {
	return api.put(`/admin/add-ons/${addOnId}`, payload, options);
};

export const deleteAddOn = async (addOnId, options = {}) => {
	return api.delete(`/admin/add-ons/${addOnId}`, options);
};
