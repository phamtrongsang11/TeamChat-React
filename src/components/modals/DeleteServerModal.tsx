import useClerkUser from '@/hooks/useClerkUser';
import { useModal } from '@/hooks/useModalStore';
import useReactMutation from '@/hooks/useReactMutation';
import { deleteServer } from '@/services/server-services';
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
import { useNavigate } from 'react-router-dom';

export const DeleteServerModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const isModalOpen = isOpen && type === 'deleteServer';
	const { server } = data;
	const { user, isLoaded } = useClerkUser();
	const navigate = useNavigate();

	const { mutate, isPending } = useReactMutation<{ id: string }>(
		deleteServer,
		'serversByUser',
		[user?.id],
		() => {
			onClose();
			window.location.replace('/');
			toast.success('Channel deleted successfully');
		}
	);

	const onClick = () => {
		mutate({
			id: server?.id!,
		});
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Delete Server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure you want to do this <br />
						<span className="font-semibold text-indigo-500">
							{server?.name}
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
