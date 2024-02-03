import { HubConnection } from '@microsoft/signalr';
import { create } from 'zustand';

interface Server {
	id?: string;
}
interface ServerStore {
	server: Server;
	connectionChannel: HubConnection;
	connectionConversation: HubConnection;
	refreshChannel: boolean;
	refreshServer: boolean;
	setServer: (id: string) => void;
	setRefreshChannel: (refresh: boolean) => void;
	setRefreshServer: (refresh: boolean) => void;
	setConnectionChannel: (connection: HubConnection) => void;
	setConnectionConversation: (connection: HubConnection) => void;
}
const useServerStore = create<ServerStore>((set) => ({
	server: {},
	connectionChannel: {} as HubConnection,
	connectionConversation: {} as HubConnection,
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
	setConnectionChannel(connection: HubConnection) {
		set({ connectionChannel: connection });
	},
	setConnectionConversation(connection: HubConnection) {
		set({ connectionConversation: connection });
	},
}));

export default useServerStore;
