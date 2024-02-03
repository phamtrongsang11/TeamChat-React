import { CreateChannelModal } from '@/components/modals/CreateChannelModal';
import { CreateServerModal } from '@/components/modals/CreateServerModal';
import { DeleteChannelModal } from '@/components/modals/DeleteChannelModal';
import { DeleteServerModal } from '@/components/modals/DeleteServerModal';
import { EditChannelModal } from '@/components/modals/EditChannelModal';
import { EditServerModal } from '@/components/modals/EditServerModal';
import { InviteModal } from '@/components/modals/InviteModal';
import { LeaveServerModal } from '@/components/modals/LeaveServerModal';
import { MembersModal } from '@/components/modals/MemberModal';
import { MessageFileModal } from '@/components/modals/MessageFileModal';
import { useEffect, useState } from 'react';
import { DeleteMessageModal } from '../components/modals/DeleteMessageModal';

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}
	return (
		<>
			<CreateServerModal />
			<CreateChannelModal />
			<EditServerModal />
			<EditChannelModal />
			<DeleteServerModal />
			<DeleteChannelModal />
			<LeaveServerModal />
			<InviteModal />
			<MembersModal />
			<MessageFileModal />
			<DeleteMessageModal />
		</>
	);
};
