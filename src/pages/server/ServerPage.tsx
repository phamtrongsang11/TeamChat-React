import useClerkUser from '@/hooks/useClerkUser';
import useReactQuery from '@/hooks/useReactQuery';
import { getServer } from '@/services/server-services';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';

const ServerIdPage = () => {
	const { serverId } = useParams<{ serverId: string }>();
	const navigate = useNavigate();

	const { isLoaded } = useClerkUser();

	const { data: server, isLoading } = useReactQuery(
		'server',
		() => getServer(serverId!),
		[serverId]
	);

	useEffect(() => {
		if (server) {
			const initialChannel = server?.channels.find((c) => c.name === 'general');

			if (!initialChannel)
				<h1>Not found general channels in server {serverId}</h1>;

			navigate(`/servers/${serverId}/channels/${initialChannel?.id}`);
		}
	}, [server]);

	if (isLoading || !isLoaded) return <Loading />;
};

export default ServerIdPage;
