import { Server } from '@/lib/types';
import { deleteOne, get, getAll, patch, post } from './api-client';
import { AxiosRequestConfig } from 'axios';

const endpoint = '/servers';

export const getServers = () => getAll<Server>(endpoint);

export const getServer = (id: string, config?: AxiosRequestConfig) =>
	get<Server>(endpoint, id, config);

export const createServer = (data: Server) => post<Server>(endpoint, data);

export const editServer = (data: Server) =>
	patch<Server>(endpoint, data, data.id);

export const deleteServer = ({ id }: { id: string }) =>
	deleteOne<Server>(endpoint, id);

export const getServersByUser = (userId: string): Promise<Server[]> =>
	getAll<Server>('/servers/member', {
		params: {
			memberId: userId,
		},
	});

export const getServerByInviteCode = (inviteCode: string) =>
	get<Server>(endpoint + '/invite', undefined, {
		params: {
			inviteCode,
		},
	});
