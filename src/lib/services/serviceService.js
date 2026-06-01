import { api } from '@/lib/api';

export const getAllServices = async (options = {}) => {
	return api.get('/services', options);
};

export const getServiceById = async (serviceId, options = {}) => {
	return api.get(`/services/${serviceId}`, options);
};

export const getAdminServices = async (options = {}) => {
	return api.get('/admin/services', options);
};

export const createService = async (payload, options = {}) => {
	return api.post('/admin/services', payload, options);
};

export const updateService = async (serviceId, payload, options = {}) => {
	return api.put(`/admin/services/${serviceId}`, payload, options);
};

export const deleteService = async (serviceId, options = {}) => {
	return api.delete(`/admin/services/${serviceId}`, options);
};

/**
 * Mengunggah gambar ke Vercel Blob via Backend
 */
export const uploadImage = async (formData, options = {}) => {
	return api.post('/admin/upload', formData, options);
};
