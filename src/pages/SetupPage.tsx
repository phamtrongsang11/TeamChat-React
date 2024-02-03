import { InitialModal } from '@/components/modals/InitialModal';
import useClerkUser from '@/hooks/useClerkUser';
import useReactQuery from '@/hooks/useReactQuery';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServersByGetOrCreateUser } from '../services/profile-services';
const SetupPage = () => {
	const { user, isLoaded } = useClerkUser();

	const navigate = useNavigate();

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

	// useEffect(() => {
	// 	const getServer = async () => {
	// 		let userId = user?.id;
	// 		try {
	// 			setIsLoading(true);
	// 			const { data: profile } = await axios.get<Profile>(
	// 				`http://localhost:5173/api/profiles/${user?.id}`
	// 			);
	// 			userId = profile.id;
	// 		} catch (error: any) {
	// 			console.log(error);
	// 			if (error.response && error.response.status === 404) {
	// 				try {
	// 					const { data: savedProfile } = await axios.post<Profile>(
	// 						`http://localhost:5173/api/profiles`,
	// 						{
	// 							id: user?.id,
	// 							name: `${user?.firstName} ${user?.lastName}`,
	// 							imageUrl: user?.imageUrl,
	// 							email: user?.emailAddresses[0].emailAddress,
	// 						}
	// 					);
	// 					userId = savedProfile.id;
	// 				} catch (error: any) {
	// 					console.log(error);
	// 				}
	// 			}
	// 		} finally {
	// 			setUser(userId!);
	// 			try {
	// 				const { data: server } = await axios.get<Server[]>(
	// 					'http://localhost:5173/api/servers/member',
	// 					{
	// 						params: {
	// 							memberId: userId,
	// 						},
	// 					}
	// 				);
	// 				setServer(server[0]);
	// 			} catch (error: any) {
	// 				console.log(error);
	// 			}
	// 			setIsLoading(false);
	// 		}
	// 	};
	// 	if (user) getServer();
	// }, [user]);

	useEffect(() => {
		if (servers && servers?.length > 0) {
			navigate(`/servers/${servers[0].id}`);
			return;
		}
	}, [servers]);

	if (error) return <h1>{error?.message}</h1>;

	if (!isLoaded || isLoading) return <h1>Loading...</h1>;

	return <InitialModal />;
};

export default SetupPage;
