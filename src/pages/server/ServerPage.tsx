import useClerkUser from '@/hooks/useClerkUser';
import useReactQuery from '@/hooks/useReactQuery';
import { getServer } from '@/services/server-services';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ServerIdPage = () => {
	const { serverId } = useParams<{ serverId: string }>();
	const navigate = useNavigate();

	const { isLoaded } = useClerkUser();

	const {
		data: server,
		isLoading,
		error,
	} = useReactQuery('server', () => getServer(serverId!), [serverId]);

	useEffect(() => {
		if (server) {
			const initialChannel = server?.channels.find((c) => c.name === 'general');

			if (!initialChannel)
				<h1>Not found general channels in server {serverId}</h1>;

			navigate(`/servers/${serverId}/channels/${initialChannel?.id}`);
		}
	}, [server]);

	if (isLoading || !isLoaded) return <h1>Loading...</h1>;
};

export default ServerIdPage;
