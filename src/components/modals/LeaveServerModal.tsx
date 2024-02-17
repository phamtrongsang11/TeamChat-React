import useClerkUser from '@/hooks/useClerkUser';
import { useModal } from '@/hooks/useModalStore';
import useReactMutation from '@/hooks/useReactMutation';
import { deleteMemberByProfile } from '@/services/member-services';
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

export const LeaveServerModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const isModalOpen = isOpen && type === 'leaveServer';
	const { server } = data;

	const { user } = useClerkUser();

	const { mutate, isPending } = useReactMutation<{ id: string }>(
		deleteMemberByProfile,
		'server',
		[server?.id],
		() => {
			onClose();
			toast.success('Member deleted successfully');
			window.location.replace('/');
		}
	);

	const onClick = () => {
		mutate({
			id: user?.id!,
		});
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Leave Server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure you want leave{' '}
						<span className="font-semibold text-indigo-500">
							{server?.name}
						</span>
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
