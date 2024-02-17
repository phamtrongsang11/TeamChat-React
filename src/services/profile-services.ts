import { Profile, Server } from '@/lib/types';
import { deleteOne, get, getAll, patch, post } from './api-client';
import { AxiosRequestConfig } from 'axios';

const endpoint = '/profiles';

export const getProfiles = () => getAll<Profile>(endpoint);

export const getProfile = (id: string, config?: AxiosRequestConfig) =>
	get<Profile>(endpoint, id, config);

export const createProfile = (data: Profile) => post<Profile>(endpoint, data);

export const editProfile = (data: Profile) =>
	patch<Profile>(endpoint, data, data.id);

export const deleteProfile = (id: string) => deleteOne<Profile>(endpoint, id);

export const getOrCreateProfile = (data: Profile) => {
	let userId = data.id;
	get<Profile>(endpoint, data.id)
		.then((foundProfile) => (userId = foundProfile.id))
		.catch((error) => {
			if (error.response && error.response.status === 404) {
				post<Profile>(endpoint, data).then(
					(savedProfile) => (userId = savedProfile.id)
				);
			}
		});
	return userId;
};

export const getServersByGetOrCreateUser = (
	data: Profile
): Promise<Server[]> => {
	const userId = getOrCreateProfile(data);

	return getAll<Server>('/servers/member', {
		params: {
			memberId: userId,
		},
	});
};
