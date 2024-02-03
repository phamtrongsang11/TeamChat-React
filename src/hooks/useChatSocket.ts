import { Member, Message, Profile } from '@/lib/types';
import {
	HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type ChatSocketProps = {
	addKey: string;
	updateKey: string;
	queryKey: string;
	connection: HubConnection;
};

type MessageWithMemberWithProfile = Message & {
	member: Member & {
		profile: Profile;
	};
};

export const useChatSocket = ({
	addKey,
	updateKey,
	queryKey,
	connection,
}: ChatSocketProps) => {
	// const connection = useServerStore((s) => s.connection);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!connection) return;

		connection.on(updateKey, (member: Member, message: Message) => {
			console.log(member, message);
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) {
					// return oldData;
					return {
						pages: [[message]],
					};
				}

				message.member = member;

				const newData = [...oldData.pages];

				newData[0] = oldData.pages[0].map(
					(item: MessageWithMemberWithProfile) => {
						if (item.id === message.id) return message;
						return item;
					}
				);
				console.log(newData);
				return { ...oldData, pages: newData };
			});
		});

		connection.on(addKey, (member: Member, message: Message) => {
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) {
					return {
						pages: [[message]],
					};
				}
				message.member = member;

				const newData = [...oldData.pages];

				newData[0] = [message, ...newData[0]];
				console.log(newData);

				return {
					...oldData,
					pages: newData,
				};
			});
		});

		return () => {
			connection.off(addKey);
			connection.off(updateKey);
		};
	}, [queryClient, addKey, queryKey, connection, updateKey]);
};
