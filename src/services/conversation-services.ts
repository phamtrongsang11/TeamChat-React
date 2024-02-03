import { Conversation, Member } from '@/lib/types';
import { deleteOne, get, getAll, patch, post } from './api-client';
import { AxiosRequestConfig } from 'axios';

const endpoint = '/conversations';

export const createConversation = (conversation: Conversation) =>
	post(endpoint + '/member', conversation);
