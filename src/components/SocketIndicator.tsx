import { Badge } from './ui/badge';
import { HubConnection } from '@microsoft/signalr';

interface SocketIndicatorProps {
	connection: HubConnection;
}

const SocketIndicator = ({ connection }: SocketIndicatorProps) => {
	if (!connection)
		return (
			<Badge variant="outline" className="bg-yellow-600 text-white border-none">
				Fallback: Polling every 1s
			</Badge>
		);

	return (
		<Badge variant="outline" className="bg-emerald-600 text-white border-none">
			Live: Real-time updates
		</Badge>
	);
};

export default SocketIndicator;
