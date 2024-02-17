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
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
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

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const isVideo = searchParams.get('video');

	const connectionConversation = useServerStore(
		(s) => s.connectionConversation
	);
	const setConnectionConversation = useServerStore(
		(s) => s.setConnectionConversation
	);

	const { data: currentMember, isLoading: loadingMember } = useReactQuery(
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
			setConversation(savedConversation);
		}
	);

	useEffect(() => {
		if (currentMember) {
			mutate({
				memberOneId: currentMember.id,
				memberTwoId: memberId,
			});
		}
		// if (!loadingMember && currentMember) {
		// 	navigate('/');
		// 	return;
		// }
	}, [currentMember]);

	useEffect(() => {
		const connectSocket = () => {
			let Sock = new SockJS(`${import.meta.env.VITE_SOCKET_URL}/ws/direct`);
			const stompClient = over(Sock);
			stompClient.connect({}, () => {}, onError);
			setConnectionConversation(stompClient);
		};
		if (!connectionConversation) connectSocket();
	}, []);

	const onError = (error: any) => {
		console.log(error);
	};

	if (
		isPending ||
		loadingMember ||
		!isLoaded ||
		!connectionConversation?.connected
	)
		return <Loading />;

	if (conversation) {
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
							connection={connectionConversation!}
						/>
						<ChatInput
							name={otherMember.profile?.name!}
							type="conversation"
							apiUrl={`${baseUrl}/chat/directmessages`}
							query={{
								memberId: currentMember?.id!,
								conversationId: conversation?.id,
							}}
							connection={connectionConversation!}
						/>
					</>
				)}
			</div>
		);
	}
};

export default ConversationPage;
