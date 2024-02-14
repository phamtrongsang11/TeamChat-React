import useClerkUser from '@/hooks/useClerkUser';
import useReactQuery from '@/hooks/useReactQuery';
import { ChannelType, MemberRole } from '@/lib/types';
import { getServer } from '@/services/server-services';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import ServerChannel from './ServerChannel';
import ServerHeader from './ServerHeader';
import ServerMember from './ServerMember';
import ServerSearch from './ServerSearch';
import ServerSection from './ServerSection';
import Loading from '../Loading';

interface ServerSidebarProps {
	serverId: string;
}

const iconMap = {
	[ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
	[ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
	[ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
	),
	[MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerSidebar = ({ serverId }: ServerSidebarProps) => {
	const { user, isLoaded } = useClerkUser();

	const {
		data: server,
		isLoading,
		error,
	} = useReactQuery('server', () => getServer(serverId!), [serverId]);

	if (isLoading || !isLoaded) return <Loading/>

	if (server) {
		const textChannels = server?.channels.filter(
			(channel) => channel.type === ChannelType.TEXT
		);
		const audioChannels = server?.channels.filter(
			(channel) => channel.type === ChannelType.AUDIO
		);
		const videoChannels = server?.channels.filter(
			(channel) => channel.type === ChannelType.VIDEO
		);

		const members = server?.members.filter(
			(member) => member.profile?.id !== user?.id
		);

		const role = server.members.find(
			(member) => member.profile?.id === user?.id
		)?.role;

		return (
			<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
				<ServerHeader server={server} role={role} />
				<ScrollArea className="flex-1 px-3">
					<div className="mt-2">
						<ServerSearch
							data={[
								{
									label: 'Text Channels',
									type: 'channel',
									data: textChannels.reverse()?.map((channel) => ({
										id: channel.id,
										name: channel.name,
										icon: iconMap[channel.type],
									})),
								},
								{
									label: 'Voice Channels',
									type: 'channel',
									data: audioChannels?.map((channel) => ({
										id: channel.id,
										name: channel.name,
										icon: iconMap[channel.type],
									})),
								},
								{
									label: 'Video Channels',
									type: 'channel',
									data: videoChannels?.map((channel) => ({
										id: channel.id,
										name: channel.name,
										icon: iconMap[channel.type],
									})),
								},
								{
									label: 'Members',
									type: 'member',
									data: members?.map((member) => ({
										id: member.id,
										name: member.profile?.name!,
										icon: roleIconMap[member.role],
									})),
								},
							]}
						/>
					</div>
					<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
					{!!textChannels?.length && (
						<div className="mb-2">
							<ServerSection
								sectionType="channels"
								channelType={ChannelType.TEXT}
								role={role}
								label="Text Channels"
							/>
							<div className="space-y-[2px]">
								{textChannels.map((channel) => (
									<ServerChannel
										key={channel.id}
										channel={channel}
										role={role}
										server={server}
									/>
								))}
							</div>
						</div>
					)}
					{!!audioChannels?.length && (
						<div className="mb-2">
							<ServerSection
								sectionType="channels"
								channelType={ChannelType.AUDIO}
								role={role}
								label="Voice Channels"
							/>
							<div className="space-y-[2px]">
								{audioChannels.map((channel) => (
									<ServerChannel
										key={channel.id}
										channel={channel}
										role={role}
										server={server}
									/>
								))}
							</div>
						</div>
					)}
					{!!videoChannels?.length && (
						<div className="mb-2">
							<ServerSection
								sectionType="channels"
								channelType={ChannelType.VIDEO}
								role={role}
								label="Video Channels"
							/>
							<div className="space-y-[2px]">
								{videoChannels.map((channel) => (
									<ServerChannel
										key={channel.id}
										channel={channel}
										role={role}
										server={server}
									/>
								))}
							</div>
						</div>
					)}
					{!!members?.length && (
						<div className="mb-2">
							<ServerSection
								sectionType="members"
								channelType={ChannelType.VIDEO}
								role={role}
								label="Members"
								server={server}
							/>
							<div className="space-y-[2px]">
								{members.map((member) => (
									<ServerMember
										key={member.id}
										member={member}
										server={server}
									/>
								))}
							</div>
						</div>
					)}
				</ScrollArea>
			</div>
		);
	}
};

export default ServerSidebar;
