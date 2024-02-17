import { Member, Message, Profile } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Client } from 'stompjs';

type ChatSocketProps = {
	addKey: string;
	updateKey: string;
	queryKey: string;
	connection: Client;
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
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!connection) return;
		const update = connection.subscribe(updateKey, (payload) => {
			var message = JSON.parse(payload.body);
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) {
					return {
						pages: [[message]],
					};
				}

				const newData = [...oldData.pages];

				newData[0] = oldData.pages[0].map(
					(item: MessageWithMemberWithProfile) => {
						if (item.id === message.id) return message;
						return item;
					}
				);
				return { ...oldData, pages: newData };
			});
		});

		const add = connection.subscribe(addKey, (payload) => {
			var message = JSON.parse(payload.body);
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) {
					return {
						pages: [[message]],
					};
				}

				const newData = [...oldData.pages];

				newData[0] = [message, ...newData[0]];

				return {
					...oldData,
					pages: newData,
				};
			});
		});

		return () => {
			update.unsubscribe();
			add.unsubscribe();
		};
	}, []);
};
