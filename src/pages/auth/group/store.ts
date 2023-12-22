import { create } from 'zustand';
import { Group, Permission } from 'declare/auth';


type State = {
    name: string;
    selectKeys: number[];
    curEditRecord: Group;
    createDialogOpen: boolean;
    groups: Group[];
    permissions: Permission[];
}

type Action = {
    updateState: (data: Partial<State>) => void;
}


const initialState: State = {
    name: '',
    selectKeys: [],
    curEditRecord: null,
    createDialogOpen: false,
    groups: [],
    permissions: []
}

export const useAuthStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))