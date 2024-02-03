import { Member } from '@/lib/types';
import { deleteOne, get, getAll, patch, post } from './api-client';
import { AxiosRequestConfig } from 'axios';

const endpoint = '/members';

export const getMembers = () => getAll<Member>(endpoint);

export const getMember = (id: string, config?: AxiosRequestConfig) =>
	get<Member>(endpoint, id, config);

export const createMember = (data: Member) => post<Member>(endpoint, data);

export const editMember = (data: Member) =>
	patch<Member>(endpoint, data, data.id);

export const deleteMember = ({ id }: { id: string }) =>
	deleteOne<Member>(endpoint, id);

export const deleteMemberByProfile = ({ id }: { id: string }) =>
	deleteOne<Member>(endpoint + '/profile', undefined, {
		params: {
			profileId: id,
		},
	});

export const findMemberByServer = (serverId: string, profileId: string) =>
	get<Member>(endpoint + '/find', undefined, {
		params: {
			serverId,
			profileId,
		},
	});
