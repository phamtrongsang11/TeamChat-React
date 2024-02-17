import useClerkUser from '@/hooks/useClerkUser';
import { useModal } from '@/hooks/useModalStore';
import { useOrigin } from '@/hooks/useOrigin';
import useReactMutation from '@/hooks/useReactMutation';
import { Server } from '@/lib/types';
import { editServer } from '@/services/server-services';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type EditInviteCode = {
	id: string;
	inviteCode: string;
};

export const InviteModal = () => {
	const { type, onOpen, isOpen, onClose, data } = useModal();
	const origin = useOrigin();
	const isModalOpen = isOpen && type === 'invite';
	const { server } = data;
	const [copied, setCopied] = useState(false);
	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

	const { user } = useClerkUser();

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	const { mutate, isPending } = useReactMutation<EditInviteCode>(
		editServer,
		'serversByUser',
		[user?.id],
		(savedServer: Server) => {
			onOpen('invite', { server: savedServer });
		}
	);

	const onNew = () => {
		mutate({
			id: server?.id!,
			inviteCode: uuidv4(),
		});
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Invite Friends
					</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
						Server invite link
					</Label>
					<div className="flex  items-center mt-2 gap-x-2">
						<Input
							disabled={isPending}
							className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
							value={inviteUrl}
						/>
						<Button disabled={isPending} onClick={onCopy} size="icon">
							{copied ? (
								<Check className="w-4 h-4" />
							) : (
								<Copy className="w-4 h-4" />
							)}
						</Button>
					</div>
					<Button
						disabled={isPending}
						variant="link"
						size="sm"
						onClick={onNew}
						className="text-xs text-zinc-500 mt-4"
					>
						Generate a new link
						<RefreshCw className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
