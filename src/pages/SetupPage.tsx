import { InitialModal } from '@/components/modals/InitialModal';
import useClerkUser from '@/hooks/useClerkUser';
import useReactQuery from '@/hooks/useReactQuery';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServersByGetOrCreateUser } from '../services/profile-services';
import Loading from '../components/Loading';
import { axiosInstance, getToken } from '@/services/api-client';
const SetupPage = () => {
	const { user, isLoaded } = useClerkUser();

	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			axiosInstance.defaults.headers['Authorization'] = `Bearer ${getToken(
				'__session'
			)}`;
		}
	}, [user]);

	const {
		data: servers,
		isLoading,
		error,
	} = useReactQuery(
		'serversByUser',
		() =>
			getServersByGetOrCreateUser({
				id: user?.id!,
				name: `${user?.firstName} ${user?.lastName}`,
				imageUrl: user?.imageUrl!,
				email: user?.emailAddresses[0].emailAddress!,
			}),
		[user?.id],
		!!user
	);

	useEffect(() => {
		if (servers && servers?.length > 0) {
			navigate(`/servers/${servers[0].id}`);
			return;
		}
	}, [servers]);

	if (error) return <h1>{error?.message}</h1>;

	if (!isLoaded || isLoading) return <Loading />;

	return <InitialModal />;
};

export default SetupPage;
