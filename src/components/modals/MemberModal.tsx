import { useModal } from '@/hooks/useModalStore';
import useReactMutation from '@/hooks/useReactMutation';
import { MemberRole, ServerWithMembersWithProfiles } from '@/lib/types';
import { deleteMember, editMember } from '@/services/member-services';
import {
	Check,
	Gavel,
	Loader2,
	MoreVertical,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import UserAvatar from '../UserAvatar';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';

const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
	ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

type ChangeRole = {
	id: string;
	role: string;
};

export const MembersModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const [loadingId, setLoadingId] = useState('');

	const isModalOpen = isOpen && type === 'members';
	const { server } = data as { server: ServerWithMembersWithProfiles };

	const { mutate } = useReactMutation<{ id: string }>(
		deleteMember,
		'server',
		[server?.id],
		() => {
			setLoadingId('');
			onClose();
			toast.success('Member deleted successfully');
		}
	);

	const { mutate: mutateRole } = useReactMutation<ChangeRole>(
		editMember,
		'server',
		[server?.id],
		() => {
			setLoadingId('');
			onClose();
			toast.success('Role changed successfully');
		}
	);

	const onKick = (memberId: string) => {
		setLoadingId(memberId);
		mutate({ id: memberId });
	};

	const onRoleChange = (memberId: string, role: MemberRole) => {
		setLoadingId(memberId);
		mutateRole({
			id: memberId,
			role,
		});
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Manage Members
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						{server?.members?.length} Members
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{server?.members?.map((member) => (
						<div key={member.id} className="flex items-center gap-x-2 mb-6">
							<UserAvatar src={member.profile?.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-xs font-semibold flex items-center gap-x-1">
									{member.profile?.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500">{member.profile?.email}</p>
							</div>
							{server.profile?.id !== member.profile?.id &&
								loadingId !== member.id && (
									<div className="ml-auto">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreVertical className="h-4 w-4 text-zinc-500" />
											</DropdownMenuTrigger>
											<DropdownMenuContent side="left">
												<DropdownMenuSub>
													<DropdownMenuSubTrigger className="flex items-center">
														<ShieldQuestion className="w-4 h-4 mr-2" />
														<span>Role</span>
													</DropdownMenuSubTrigger>
													<DropdownMenuPortal>
														<DropdownMenuSubContent>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(member.id, MemberRole.GUEST)
																}
															>
																<Shield className="h-4 w-4 mr-2" />
																Guest
																{member.role === MemberRole.GUEST && (
																	<Check className="h4 w-4 ml-auto" />
																)}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(member.id, MemberRole.MODERATOR)
																}
															>
																<ShieldCheck className="h-4 w-4 mr-2" />
																Moderator
																{member.role === MemberRole.MODERATOR && (
																	<Check className="h4 w-4 ml-auto" />
																)}
															</DropdownMenuItem>
														</DropdownMenuSubContent>
													</DropdownMenuPortal>
												</DropdownMenuSub>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => onKick(member.id)}>
													<Gavel className="h-4 w-4 mr-2" />
													Kick
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
							{loadingId === member.id && (
								<Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
