import NavigationSidebar from '@/components/navigation/NavigationSidebar';
import ServerSidebar from '@/components/servers/ServerSidebar';
import { Outlet, useParams } from 'react-router-dom';

const Layout = () => {
	const { serverId } = useParams<{ serverId: string }>();

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
