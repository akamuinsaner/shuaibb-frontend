import { create } from 'zustand';
import { Customer } from 'declare/customer';
import { OrderParams, PageInfo } from 'components/ListTable';
import { Schedule } from 'declare/schedule';

type State = {
    orderParams: OrderParams<Schedule>;
    errors: { [name: string]: string };
    list: Schedule[];
    filterParams: { [name: string]: any };
    pageInfo: PageInfo;
    selectedKeys: any[];
}

type Action = {
    updateState: (data: Partial<State>) => void;
}


const initialState: State = {
    orderParams: { order: 'asc', orderBy: null },
    errors: {},
    list: [],
    filterParams: {},
    pageInfo: { total: 0, limit: 10, offset: 0 },
    selectedKeys: []
}

export const useStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))