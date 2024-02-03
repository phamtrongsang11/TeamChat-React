import useServerStore from '@/hooks/useServerStore';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import ActionTooltip from '../TooltipAction';

interface NavigationItemProps {
	id: string;
	imageUrl: string;
	name: string;
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
	const params = useParams();
	const navigate = useNavigate();
	const setServerId = useServerStore((s) => s.setServer);

	const onClick = () => {
		setServerId(id);
		navigate(`/servers/${id}`);
	};

	return (
		<ActionTooltip side="right" align="center" label={name}>
			<button onClick={onClick} className="group relative flex items-center">
				<div
					className={cn(
						'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
						params?.serverId !== id && 'group-hover:h-[20px]',
						params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
					)}
				/>
				<div
					className={cn(
						'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
						params?.serverId === id &&
							'bg-primary/10 text-primary rounded-[16px]'
					)}
				>
					<img
						src={imageUrl}
						alt="server"
						className="object-fill w-100 h-100"
					/>
				</div>
			</button>
		</ActionTooltip>
	);
};

export default NavigationItem;
