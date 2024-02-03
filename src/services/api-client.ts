import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
});

export const getAll = <T>(endpoint: string, config?: AxiosRequestConfig) => {
	return axiosInstance.get<T[]>(endpoint, config).then((res) => res.data);
};

export const get = <T>(
	endpoint: string,
	id?: string,
	config?: AxiosRequestConfig
) => {
	return axiosInstance
		.get<T>(id ? endpoint + `/${id}` : endpoint, config)
		.then((res) => res.data);
};

export const post = <T>(
	endpoint: string,
	data: T,
	config?: AxiosRequestConfig
) => {
	return axiosInstance.post<T>(endpoint, data, config).then((res) => res.data);
};

export const patch = <T>(
	endpoint: string,
	data?: T,
	id?: string,
	config?: AxiosRequestConfig
) => {
	return axiosInstance
		.patch<T>(id ? endpoint + `/${id}` : endpoint, data, config)
		.then((res) => res.data);
};

export const deleteOne = <T>(
	endpoint: string,
	id?: string,
	config?: AxiosRequestConfig
) => {
	return axiosInstance
		.delete<T>(id ? endpoint + `/${id}` : endpoint, config)
		.then((res) => res.data);
};
