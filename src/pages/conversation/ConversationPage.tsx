import { MediaRoom } from '@/components/MediaRoom';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessage';
import useClerkUser from '@/hooks/useClerkUser';
import useReactMutation from '@/hooks/useReactMutation';
import useReactQuery from '@/hooks/useReactQuery';
import useServerStore from '@/hooks/useServerStore';
import { Conversation } from '@/lib/types';
import { createConversation } from '@/services/conversation-services';
import { findMemberByServer } from '@/services/member-services';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';

type createConversationProps = {
	memberOneId?: string;
	memberTwoId?: string;
};

const ConversationPage = () => {
	const navigate = useNavigate();
	const [conversation, setConversation] = useState<Conversation>();
	const { serverId, memberId } = useParams<{
		serverId: string;
		memberId: string;
	}>();
	const baseUrl = import.meta.env.VITE_BASE_URL;

	const { user, isLoaded } = useClerkUser();

	const [loadingConnect, setLoadingConnect] = useState(false);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const isVideo = searchParams.get('video');

	const connectionConversation = useServerStore(
		(s) => s.connectionConversation
	);
	const setConnectionConversation = useServerStore(
		(s) => s.setConnectionConversation
	);

	const {
		data: currentMember,
		isLoading: loadingMember,
		error,
	} = useReactQuery(
		'member',
		() => findMemberByServer(serverId!, user?.id!),
		[serverId, user?.id],
		!!user
	);

	const { mutate, isPending } = useReactMutation<createConversationProps>(
		createConversation,
		'conversation',
		undefined,
		(savedConversation: Conversation) => {
			if (!savedConversation) {
				navigate(`/servers/${serverId}`);
				return;
			}
			setLoadingConnect(true);
			setConversation(savedConversation);
			connectSocket(savedConversation.id);
		}
	);

	useEffect(() => {
		if (currentMember) {
			mutate({
				memberOneId: currentMember.id,
				memberTwoId: memberId,
			});
		}
		if (!loadingMember && currentMember) {
			navigate('/');
			return;
		}
	}, [currentMember]);

	const connectSocket = async (savedConversationId: string) => {
		const connection = new HubConnectionBuilder()
			.withUrl(`${import.meta.env.VITE_BASE_URL}/chat/directMessage`)
			.configureLogging(LogLevel.Information)
			.build();

		setConnectionConversation(connection);

		await connection.start();

		const userId = user?.id;
		const conversationId = savedConversationId;
		await connection.invoke('ConnectConversation', {
			userId,
			conversationId,
		});
		setLoadingConnect(false);
	};

	if (isPending || loadingMember || !isLoaded || loadingConnect)
		return <Loading/>

	if (conversation && !loadingConnect) {
		const { memberOne, memberTwo } = conversation!;

		const otherMember =
			memberOne.profile?.id! === user?.id ? memberTwo : memberOne;

		return (
			<div className="bg-white h-[100vh] dark:bg-[#313338] flex flex-col">
				<ChatHeader
					imageUrl={otherMember.profile?.imageUrl}
					name={otherMember.profile?.name!}
					serverId={serverId!}
					type="conversation"
				/>
				{isVideo && (
					<MediaRoom chatId={conversation?.id!} video={true} audio={true} />
				)}
				{!isVideo && (
					<>
						<ChatMessages
							member={currentMember!}
							name={otherMember.profile?.name!}
							chatId={conversation?.id!}
							type="conversation"
							apiUrl={`${baseUrl}/directmessages/conversation`}
							paramKey="conversationId"
							paramValue={conversation?.id!}
							socketUrl={`${baseUrl}/chat/directmessages`}
							socketQuery={{
								memberId: currentMember?.id!,
								conversationId: conversation?.id!,
							}}
							connection={connectionConversation}
						/>
						<ChatInput
							name={otherMember.profile?.name!}
							type="conversation"
							apiUrl={`${baseUrl}/chat/directmessages`}
							query={{
								memberId: currentMember?.id!,
								conversationId: conversation?.id,
							}}
							connection={connectionConversation}
						/>
					</>
				)}
			</div>
		);
	}
};

export default ConversationPage;
