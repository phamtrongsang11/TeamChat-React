import { Conversation } from '@/lib/types';
import { post } from './api-client';

const endpoint = '/conversations';

export const createConversation = (conversation: Conversation) =>
	post(endpoint + '/member', conversation);
