import { useModal } from '@/hooks/useModalStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Client } from 'stompjs';
import * as z from 'zod';
import EmojiPicker from '../EmojiPicker';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';

interface ChatInputProps {
	apiUrl: string;
	query: Record<string, any>;
	name: string;
	type: 'conversation' | 'channel';
	connection: Client;
}

const formSchema = z.object({
	content: z.string().min(1),
});

const ChatInput = ({
	apiUrl,
	query,
	name,
	type,
	connection,
}: ChatInputProps) => {
	const { onOpen } = useModal();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: '',
		},
	});
	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (value: z.infer<typeof formSchema>) => {
		try {
			const message = { ...query, ...value };
			const url =
				type == 'channel' ? 'message.addMessage' : 'directMessage.addMessage';
			connection.send(`/chat/${url}`, {}, JSON.stringify(message));
			form.reset();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative p-4 pb-6">
									<button
										type="button"
										onClick={() => onOpen('messageFile', { apiUrl, query })}
										className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
									>
										<Plus className="text-white dark:text-[#313338]" />
									</button>
									<Input
										disabled={isLoading}
										className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
										placeholder={`Message ${
											type === 'conversation' ? name : '#' + name
										}`}
										{...field}
									/>
									<div className="absolute top-7 right-8">
										<EmojiPicker
											onChange={(emoji: string) =>
												field.onChange(`${field.value} ${emoji}`)
											}
										/>
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default ChatInput;
