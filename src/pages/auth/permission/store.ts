import { create } from 'zustand';
import { Group, Permission } from 'declare/auth';
import { PageInfo } from 'components/ListTable';


type State = {
    name: string;
    selectKeys: number[];
    curEditRecord: Permission;
    createDialogOpen: boolean;
    permissions: Permission[];
    pageInfo: PageInfo
}

type Action = {
    updateState: (data: Partial<State>) => void;
}


const initialState: State = {
    name: '',
    selectKeys: [],
    curEditRecord: null,
    createDialogOpen: false,
    permissions: [],
    pageInfo: {
        offset: 0,
        total: 0,
        limit: 15,
    }
}

export const usePermissionStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))