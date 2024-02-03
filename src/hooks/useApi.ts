import { useState } from 'react';
function useApiResponseListData<T>(apiFunction: any) {
	const [data, setData] = useState<T[]>([]);
	const [error, setError] = useState<any>('');
	const [loading, setLoading] = useState(false);

	const request = async (...args: any) => {
		try {
			setLoading(true);
			const { data } = await apiFunction(...args);
			setData(data);
		} catch (error: any) {
			setError(error);
		}
		setLoading(false);
	};

	return { data, setData, error, loading, request };
}

function useApiResponseWithData<T>(apiFunction: any) {
	const [data, setData] = useState<T>();
	const [error, setError] = useState<any>('');
	const [loading, setLoading] = useState(false);

	const request = async (...args: any) => {
		try {
			setLoading(true);
			const { data } = await apiFunction(...args);
			setData(data);
		} catch (error: any) {
			setError(error);
		}
		setLoading(false);
	};

	return { data, setData, error, loading, request };
}

export default {
	useApiResponseListData,
	useApiResponseWithData,
};
