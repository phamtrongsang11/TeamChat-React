import { Channel } from '@/lib/types';
import { AxiosRequestConfig } from 'axios';
import { deleteOne, get, getAll, patch, post } from './api-client';

const endpoint = '/channels';

export const getChannels = () => getAll<Channel>(endpoint);

export const getChannel = (id: string, config?: AxiosRequestConfig) =>
	get<Channel>(endpoint, id, config);

export const createChannel = (data: Channel) => post<Channel>(endpoint, data);

export const editChannel = (data: Channel) =>
	patch<Channel>(endpoint, data, data.id);

export const deleteChannel = ({ id }: { id: string }) =>
	deleteOne<Channel>(endpoint, id);
