import { create } from 'zustand';
import { Customer } from 'declare/customer';
import { PageInfo } from 'components/ListTable';

type State = {
    filterParams: { [name: string]: any };
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
    filterParams: {},
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