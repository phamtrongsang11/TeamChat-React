import qs from 'query-string';

import { useInfiniteQuery } from '@tanstack/react-query';
import { HubConnection } from '@microsoft/signalr';

// import { useSocket } from '@/components/providers/socket-provider';

interface ChatQueryProps {
	queryKey: string;
	apiUrl: string;
	paramKey: 'channelId' | 'conversationId';
	paramValue: string;
	connection: HubConnection;
}

export const useChatQuery = ({
	queryKey,
	apiUrl,
	paramKey,
	paramValue,
	connection,
}: ChatQueryProps) => {
	const fetchMessages = async ({ pageParam = undefined }) => {
		console.log(pageParam);
		const url = qs.stringifyUrl(
			{
				url: apiUrl,
				query: {
					cursor: pageParam,
					[paramKey]: paramValue,
				},
			},
			{ skipNull: true }
		);
		const res = await fetch(url);
		return res.json();
	};

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteQuery(
			//@ts-ignore
			{
				queryKey: [queryKey],
				queryFn: fetchMessages,
				getNextPageParam: (lastPage) => lastPage?.nextCursor,
				refetchInterval: connection ? false : 2000,
			}
		);

	return {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	};
};
