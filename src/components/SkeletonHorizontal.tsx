import { Skeleton } from './ui/skeleton';

const SkeletonHorizontal = () => {
	return (
		<div className="flex flex-col space-y-3 p-3">
			<div className="space-y-2">
				<Skeleton className="h-4 w-[220px] dark:bg-[#2B2D31] bg-[#F2F3F5]" />
				<Skeleton className="h-4 w-[180px] dark:bg-[#2B2D31] bg-[#F2F3F5]" />
				<Skeleton className="h-4 w-[140px] dark:bg-[#2B2D31] bg-[#F2F3F5]" />
			</div>
		</div>
	);
};

export default SkeletonHorizontal;
