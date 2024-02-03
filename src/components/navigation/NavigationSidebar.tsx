import useClerkUser from '@/hooks/useClerkUser';
import useReactQuery from '@/hooks/useReactQuery';
import { getServersByUser } from '@/services/server-services';
import { UserButton } from '@clerk/clerk-react';
import { ModeToggle } from '../ModeToggle';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import NavigationAction from './NavigationAction';
import NavigationItem from './NavigationItem';

const NavigationSidebar = () => {
	const { user, isLoaded } = useClerkUser();

	const {
		data: servers,
		isLoading,
		error,
	} = useReactQuery(
		'serversByUser',
		() => getServersByUser(user?.id!),
		[user?.id],
		!!user
	);

	if (isLoading || !isLoaded) return <h1>Loading...</h1>;

	return (
		<div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
			<NavigationAction />
			<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
			<ScrollArea className="flex-1 w-full">
				{servers!.map((server) => (
					<div key={server.id} className="mb-4">
						<NavigationItem
							id={server.id}
							name={server.name}
							imageUrl={server.imageUrl}
						/>
					</div>
				))}
			</ScrollArea>
			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
				<ModeToggle />
				<UserButton
					afterSignOutUrl="/auth/signin"
					appearance={{
						elements: {
							avatarBox: 'h-[48px] w-[48px]',
						},
					}}
				/>
			</div>
		</div>
	);
};

export default NavigationSidebar;
