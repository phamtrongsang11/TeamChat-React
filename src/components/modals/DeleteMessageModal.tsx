import { useModal } from '@/hooks/useModalStore';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';

export const DeleteMessageModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const [isLoading, setIsLoading] = useState(false);
	const { query, typeMessage } = data;
	const isModalOpen = isOpen && type === 'deleteMessage';
	const { connection } = data;

	const onClick = async () => {
		try {
			setIsLoading(true);

			if (connection) {
				const message = { ...query };

				const url =
					type && typeMessage == 'channel'
						? 'message.deleteMessage'
						: 'directMessage.deleteMessage';
				connection.send('/chat/' + url, {}, JSON.stringify(message));
			}

			onClose();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Delete Message
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure you want to do this <br />
						This message will be permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} onClick={onClose} variant="ghost">
							Cancel
						</Button>
						<Button onClick={onClick} disabled={isLoading} variant="primary">
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
