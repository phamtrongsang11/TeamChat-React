import { create } from 'zustand';

interface User {
	id?: string;
}
interface UserStore {
	user: User;
	setUser: (id: string) => void;
}
const useUserStore = create<UserStore>((set) => ({
	user: {},
	setUser(id) {
		set({ user: { id } });
	},
}));

export default useUserStore;
