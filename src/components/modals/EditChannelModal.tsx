import { useModal } from '@/hooks/useModalStore';
import useReactMutation from '@/hooks/useReactMutation';
import { ChannelType } from '@/lib/types';
import { editChannel } from '@/services/channel-services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

const formSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: 'Channel name is required',
		})
		.refine((name) => name !== 'general', {
			message: "Channel name cannot be 'general'",
		}),
	type: z.nativeEnum(ChannelType),
});

type UpdateChannelProps = {
	id: string;
	name: string;
	type: string;
};

export const EditChannelModal = () => {
	const { type, isOpen, onClose, data } = useModal();
	const isModalOpen = isOpen && type === 'editChannel';
	const { channel, server } = data;

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			type: channel?.type || ChannelType.TEXT,
		},
	});

	useEffect(() => {
		if (channel) {
			form.setValue('name', channel.name);
			form.setValue('type', channel.type);
		}
	}, [form, channel]);

	const isLoading = form.formState.isSubmitting;

	const { mutate } = useReactMutation<UpdateChannelProps>(
		editChannel,
		'server',
		[server?.id],
		() => {
			form.reset();
			onClose();
			toast.success('Channel deleted successfully');
		}
	);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		mutate({
			...values,
			id: channel?.id!,
		});
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Edit Channel
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Channel name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="bg-zinc-300/50 boder-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter channel name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Type</FormLabel>
										<Select
											disabled={isLoading}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
													<SelectValue placeholder="Select a channel type" />
													<SelectContent>
														{Object.values(ChannelType).map((type) => (
															<SelectItem
																key={type}
																value={type}
																className="capitalize"
															>
																{type.toLowerCase()}
															</SelectItem>
														))}
													</SelectContent>
												</SelectTrigger>
											</FormControl>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant="primary" disabled={isLoading}>
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
