import { create } from 'zustand';
import { Customer } from 'declare/customer';
import { PageInfo } from 'components/ListTable';

type State = {
    keyword: string;
    selectKeys: number[];
    curEditRecord: Customer;
    createDialogOpen: boolean;
    customers: Customer[];
    pageInfo: PageInfo;
}

type Action = {
    updateState: (data: Partial<State>) => void;
}


const initialState: State = {
    keyword: '',
    selectKeys: [],
    curEditRecord: null,
    createDialogOpen: false,
    customers: [],
    pageInfo: {
        offset: 0,
        limit: 10,
        total: 0
    }
}

export const useCustomerStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))