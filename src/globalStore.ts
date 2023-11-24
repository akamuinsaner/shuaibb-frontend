import { create } from 'zustand';
import { User } from 'common/types';

export type state = {
    token: string;
    user?: User
}

export type action = {
    updateState: (data: Partial<state>)  => void
}

const token = localStorage.getItem('__token__')


const useGlobalStore = create<state & action>((set) => ({
    token: token,
    user: null,
    updateState: (data) => set((state) => ({ ...data })),
}))



export default useGlobalStore