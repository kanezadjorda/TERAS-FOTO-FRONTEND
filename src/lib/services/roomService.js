import { api } from '@/lib/api';

export const getAllRooms = async (options = {}) => {
	return api.get('/rooms', options);
};

export const getAdminRooms = async (options = {}) => {
	return api.get('/admin/rooms', options);
};

export const createRoom = async (payload, options = {}) => {
	return api.post('/admin/rooms', payload, options);
};

export const updateRoom = async (roomId, payload, options = {}) => {
	return api.put(`/admin/rooms/${roomId}`, payload, options);
};

export const deleteRoom = async (roomId, options = {}) => {
	return api.delete(`/admin/rooms/${roomId}`, options);
};
