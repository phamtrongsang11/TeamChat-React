import useClerkUser from '@/hooks/useClerkUser';
import useReactMutation from '@/hooks/useReactMutation';
import useReactQuery from '@/hooks/useReactQuery';
import { Member, MemberRole } from '@/lib/types';
import { createMember } from '@/services/member-services';
import { getServerByInviteCode } from '@/services/server-services';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type SaveMemberProps = {
	role: string;
	serverId?: string;
	profileId?: string;
};

const InvitePage = () => {
	const navigate = useNavigate();
	const { inviteCode } = useParams<{ inviteCode: string }>();

	const { user, isLoaded } = useClerkUser();

	const {
		data: server,
		isLoading,
		error,
	} = useReactQuery(
		'serverByInviteCode',
		() => getServerByInviteCode(inviteCode!),
		[inviteCode]
	);

	const { mutate, isPending } = useReactMutation<SaveMemberProps>(
		createMember,
		'server',
		[server?.id],
		(savedMember: Member) => {
			if (savedMember) {
				navigate(`/servers/${server?.id}`);
				return;
			}
		}
	);

	useEffect(() => {
		if (
			!isLoading &&
			(!server || server.members.find((m) => m.profile?.id! == user?.id))
		) {
			navigate('/');
			return;
		}
		if (server)
			mutate({
				serverId: server?.id,
				profileId: user?.id,
				role: MemberRole.GUEST,
			});
	}, [server]);

	if (error) {
		navigate('/');
		return;
	}

	if (isLoading || !isLoaded || isPending) return <h1>Loading...</h1>;
};

export default InvitePage;
