import qs from 'query-string';

import { Video, VideoOff } from 'lucide-react';
import ActionTooltip from '../TooltipAction';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatVideoButton = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const isVideo = searchParams.get('video');

	const onClick = () => {
		const url = qs.stringifyUrl(
			{
				url: location.pathname || '',
				query: {
					video: isVideo ? undefined : 'true',
				},
			},
			{ skipNull: true }
		);
		navigate(url);
	};

	const Icon = isVideo ? VideoOff : Video;
	const tooltipLabel = isVideo ? 'End video call' : 'Start video call';
	return (
		<ActionTooltip side="bottom" label={tooltipLabel}>
			<button onClick={onClick} className="hover:opacity-75 transition mr-4">
				<Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
			</button>
		</ActionTooltip>
	);
};

export default ChatVideoButton;
