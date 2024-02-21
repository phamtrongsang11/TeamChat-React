import { useChatQuery } from '@/hooks/useChatQuery';
import { useChatScroll } from '@/hooks/useChatScroll';
import { useChatSocket } from '@/hooks/useChatSocket';
import { Member, Message, Profile } from '@/lib/types';
import { format } from 'date-fns';
import { Loader2, ServerCrash } from 'lucide-react';
import { ElementRef, Fragment, useRef } from 'react';
import { Client } from 'stompjs';
import ChatItem from './ChatItem';
import ChatWelcome from './ChatWelcome';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type MessageWithMemberWithProfile = Message & {
	member: Member & {
		profile: Profile;
	};
};

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: 'channelId' | 'conversationId';
	paramValue: string;
	type: 'channel' | 'conversation';
	connection: Client;
}

function getTimeWithoutDecimal(time: Date) {
	return time ? time.toString().split('.')[0] : '';
}

const ChatMessages = ({
	name,
	member,
	chatId,
	apiUrl,
	socketUrl,
	socketQuery,
	paramKey,
	paramValue,
	type,
	connection,
}: ChatMessagesProps) => {
	const queryKey = `chat:${chatId}`;
	const addKey = `/ReceiveMessage/${chatId}`;
	const updateKey = `/ReceiveUpdateMessage/${chatId}`;

	const chatRef = useRef<ElementRef<'div'>>(null);
	const bottomRef = useRef<ElementRef<'div'>>(null);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({
			queryKey,
			apiUrl,
			paramKey,
			paramValue,
			connection,
		});

	useChatSocket({ queryKey, addKey, updateKey, connection });
	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		count: data?.pages?.[0]?.length ?? 0,
	});

	if (status === 'pending')
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Loading messages...
				</p>
			</div>
		);
	if (status === 'error')
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<ServerCrash className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Something went wrong!
				</p>
			</div>
		);
	if (data) console.log(data);
	return (
		<div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
			{!hasNextPage && <div className="flex-1" />}
			{!hasNextPage && <ChatWelcome type={type} name={name} />}
			{hasNextPage && (
				<div className="flex justify-center">
					{isFetchingNextPage ? (
						<Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
					) : (
						<button
							onClick={() => fetchNextPage()}
							className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300"
						>
							Load previous message
						</button>
					)}
				</div>
			)}
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, i) => (
					<Fragment key={i}>
						{group.length > 0 &&
							group.map((message: MessageWithMemberWithProfile) => (
								<div key={message.id}>
									<ChatItem
										key={message.id}
										id={message.id}
										type={type}
										currentMember={member}
										member={message.member}
										content={message.content}
										fileUrl={message.fileUrl}
										deleted={message.deleted}
										timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
										isUpdated={
											getTimeWithoutDecimal(message.updatedAt) !==
											getTimeWithoutDecimal(message.createdAt)
										}
										socketUrl={socketUrl}
										socketQuery={socketQuery}
										connection={connection}
									/>
								</div>
							))}
					</Fragment>
				))}
			</div>
			<div ref={bottomRef} />
		</div>
	);
};

export default ChatMessages;
