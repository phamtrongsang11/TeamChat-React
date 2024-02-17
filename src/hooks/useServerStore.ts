import { Client } from 'stompjs';
import { create } from 'zustand';

interface Server {
	id?: string;
}
interface ServerStore {
	server: Server;
	connectionChannel: Client | null;
	connectionConversation: Client | null;
	refreshChannel: boolean;
	refreshServer: boolean;
	setServer: (id: string) => void;
	setRefreshChannel: (refresh: boolean) => void;
	setRefreshServer: (refresh: boolean) => void;
	setConnectionChannel: (connection: Client) => void;
	setConnectionConversation: (connection: Client) => void;
}
const useServerStore = create<ServerStore>((set) => ({
	server: {},
	connectionChannel: null,
	connectionConversation: null,
	refreshChannel: false,
	refreshServer: false,
	setServer(id) {
		set({ server: { id } });
	},
	setRefreshChannel(refresh) {
		set({ refreshChannel: refresh });
	},
	setRefreshServer(refresh) {
		set({ refreshServer: refresh });
	},
	setConnectionChannel(connection: Client) {
		set({ connectionChannel: connection });
	},
	setConnectionConversation(connection: Client) {
		set({ connectionConversation: connection });
	},
}));

export default useServerStore;
