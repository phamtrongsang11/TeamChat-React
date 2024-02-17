import { Client } from 'stompjs';
import { Badge } from './ui/badge';

interface SocketIndicatorProps {
	connection: Client;
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
