import { create } from 'zustand';
import { User, ERole } from 'declare/user';
import { PageInfo } from 'components/ListTable';


type State = {
    filterParams: { [name: string] : any };
    selectKeys: number[];
    curEditRecord: User;
    createDialogOpen: boolean;
    users: User[];
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
    users: [],
    pageInfo: {
        offset: 0,
        total: 0,
        limit: 15,
    }
}

export const useUsersStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))