import { Skeleton } from './ui/skeleton';

const SkeletonCircle = () => {
	return (
		<div className="flex flex-col items-center justify-center space-x-4 p-4 gap-3">
			<Skeleton className="h-12 w-12 rounded-full dark:bg-[#2B2D31] bg-[#F2F3F5]" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-[60px] dark:bg-[#2B2D31] bg-[#F2F3F5]" />
				<Skeleton className="h-4 w-[40px] dark:bg-[#2B2D31] bg-[#F2F3F5]" />
			</div>
		</div>
	);
};

export default SkeletonCircle;
