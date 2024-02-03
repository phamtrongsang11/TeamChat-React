import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import NavigationSidebar from '@/components/navigation/NavigationSidebar';
import useUserStore from '@/hooks/useUserStore';
import ServerSidebar from '@/components/servers/ServerSidebar';
import useClerkUser from '@/hooks/useClerkUser';

const Layout = () => {
	const { serverId } = useParams<{ serverId: string }>();
	const {} = useClerkUser();
	return (
		<>
			<div className="h-full">
				<div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
					<NavigationSidebar />
				</div>
				<div className="md:pl-[72px] h-full">
					<div className="h-full">
						<div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
							<ServerSidebar serverId={serverId!} />
						</div>
						<main className="h-full md:pl-60">
							<Outlet />
						</main>
					</div>
				</div>
			</div>
		</>
	);
};

export default Layout;
