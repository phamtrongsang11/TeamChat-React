import useClerkUser from '@/hooks/useClerkUser';
import '@livekit/components-styles';
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	VideoConference,
	useTracks,
} from '@livekit/components-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from './Loading';
import { Track } from 'livekit-client';

interface MediaRoomProps {
	chatId: string;
	video: boolean;
	audio: boolean;
}

const serverUrl = 'wss://discord-tutorial-bp7ndoq5.livekit.cloud';

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
	const { user, isLoaded } = useClerkUser();
	const [token, setToken] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const getToken = async () => {
			try {
				setIsLoading(true);
				const { data } = await axios.post('http://localhost:5173/token', {
					user: user?.id,
					room: chatId,
				});
				setToken(data);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		if (isLoaded) getToken();
	}, [isLoaded]);

	if (isLoading || !isLoaded) return <Loading />;

	return (
		// <LiveKitRoom
		// 	data-lk-theme="default"
		// 	serverUrl={serverUrl}
		// 	token={token}
		// 	connect={true}
		// 	video={video}
		// 	audio={audio}
		// >
		// 	<VideoConference />
		// </LiveKitRoom>
		<LiveKitRoom
			video={video}
			audio={audio}
			token={token}
			serverUrl={serverUrl}
			data-lk-theme="default"
			style={{ height: '100vh' }}
		>
			<MyVideoConference />
			<RoomAudioRenderer />
			<ControlBar />
		</LiveKitRoom>
	);
};

function MyVideoConference() {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: false }
	);
	return (
		<GridLayout
			tracks={tracks}
			style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
		>
			<ParticipantTile />
		</GridLayout>
	);
}
