import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

interface MediaRoomProps {
	chatId: string;
	video: boolean;
	audio: boolean;
}

const serverUrl = 'wss://discord-tutorial-bp7ndoq5.livekit.cloud';
const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDYwNjc3MTYsImlzcyI6IkFQSTJIRTJCZnJ4U0ZNYSIsIm5iZiI6MTcwNTk4MTMxNiwic3ViIjoicXVpY2tzdGFydCB1c2VyIDU5bjltZSIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.08SFSZfw2UQqVAgJu_Dfs71EYrUcsw5eJasmA-0bbEQ';

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
	return (
		<LiveKitRoom
			data-lk-theme="default"
			serverUrl={serverUrl}
			token={token}
			connect={true}
			video={video}
			audio={audio}
		>
			<VideoConference />
		</LiveKitRoom>
	);
};

