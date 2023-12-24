import { create } from 'zustand';
import { Group, Permission } from 'declare/auth';
import { PageInfo } from 'components/ListTable';


type State = {
    filterParams: { [name: string]: any };
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
    filterParams: {},
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