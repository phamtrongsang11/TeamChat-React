import { MediaRoom } from '@/components/MediaRoom';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessage';
import useClerkUser from '@/hooks/useClerkUser';
import useReactQuery from '@/hooks/useReactQuery';
import useServerStore from '@/hooks/useServerStore';
import { ChannelType } from '@/lib/types';
import { getChannel } from '@/services/channel-services';
import { findMemberByServer } from '@/services/member-services';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';

import SockJS from 'sockjs-client';
import { over } from 'stompjs';

const ChannelIdPage = () => {
	const setConnection = useServerStore((s) => s.setConnectionChannel);
	const connectionChannel = useServerStore((s) => s.connectionChannel);
	const navigate = useNavigate();
	const baseUrl = import.meta.env.VITE_BASE_URL;

	const { serverId, channelId } = useParams<{
		serverId: string;
		channelId: string;
	}>();

	const { user, isLoaded } = useClerkUser();

	const { data: channel, isLoading: loadingChannel } = useReactQuery(
		'channel',
		() => getChannel(channelId!),
		[channelId]
	);

	const { data: member, isLoading: loadingMember } = useReactQuery(
		'member',
		() => findMemberByServer(serverId!, user?.id!),
		[serverId, user?.id],
		!!user
	);

	useEffect(() => {
		if (!loadingChannel && !loadingMember && !channel && !member) {
			navigate('/');
			return;
		}
	}, [channel, member]);

	useEffect(() => {
		const connectSocket = () => {
			let Sock = new SockJS(`${import.meta.env.VITE_SOCKET_URL}/ws`);
			const stompClient = over(Sock);
			stompClient.connect(
				{},
				() => {
					setConnection(stompClient);
				},
				onError
			);
		};
		if (!connectionChannel) connectSocket();
	}, []);

	const onError = (error: any) => {
		console.log(error);
	};

	if (
		loadingChannel ||
		loadingMember ||
		!isLoaded ||
		!connectionChannel?.connected
	) {
		return <Loading />;
	}

	return (
		<div className="bg-white dark:bg-[#31333B] flex flex-col h-[100vh]">
			<ChatHeader
				name={channel?.name!}
				serverId={channel?.server?.id!}
				type="channel"
			/>
			{channel?.type! === ChannelType.TEXT && (
				<>
					<ChatMessages
						member={member!}
						name={channel?.name!}
						chatId={channel?.id!}
						type="channel"
						apiUrl={`${baseUrl}/messages/channel`}
						socketUrl={`${baseUrl}/chat/messages`}
						socketQuery={{
							channelId: channel?.id!,
						}}
						paramKey="channelId"
						paramValue={channel?.id!}
						connection={connectionChannel!}
					/>
					<ChatInput
						name={channel?.name!}
						type="channel"
						apiUrl={`${baseUrl}/chat/messages`}
						query={{
							channelId: channel?.id!,
							memberId: member?.id!,
						}}
						connection={connectionChannel!}
					/>
				</>
			)}
			{channel?.type === ChannelType.AUDIO && (
				<MediaRoom chatId={channel.id} video={false} audio={true} />
			)}
			{channel?.type === ChannelType.VIDEO && (
				<MediaRoom chatId={channel.id} video={true} audio={true} />
			)}
		</div>
	);
};

export default ChannelIdPage;
