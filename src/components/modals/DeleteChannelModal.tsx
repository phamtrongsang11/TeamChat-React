import { useModal } from '@/hooks/useModalStore';
import useReactMutation from '@/hooks/useReactMutation';
import { deleteChannel } from '@/services/channel-services';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';

export const DeleteChannelModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const isModalOpen = isOpen && type === 'deleteChannel';
	const { server, channel } = data;

	const { mutate, isPending } = useReactMutation<{ id: string }>(
		deleteChannel,
		'server',
		[server?.id],
		() => {
			onClose();
			toast.success('Channel deleted successfully');
		}
	);

	const onClick = () => {
		mutate({
			id: channel?.id!,
		});
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Delete Channel
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure you want to do this <br />
						<span className="font-semibold text-indigo-500">
							#{channel?.name}
						</span>{' '}
						will be permanently deleted
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isPending} onClick={onClose} variant="ghost">
							Cancel
						</Button>
						<Button onClick={onClick} disabled={isPending} variant="primary">
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
