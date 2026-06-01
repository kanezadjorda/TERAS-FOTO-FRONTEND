import { api } from '@/lib/api';

export const register = async (payload, options = {}) => {
	return api.post('/auth/register', payload, options);
};

export const login = async (payload, options = {}) => {
	return api.post('/auth/login', payload, options);
};
