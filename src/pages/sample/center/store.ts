import { create } from 'zustand';
import dayjs from 'dayjs'
import type { SampleLabel, SampleData } from 'declare/sample';
import { PageInfo, OrderParams } from 'components/ListTable';

type fieldState<T> = {
    value: T;
    errText: string
}

type state = {
    name: fieldState<string>;
    tagIds: fieldState<number[]>,
    startDate: fieldState<string>,
    endDate: fieldState<string>,
    orderParams: OrderParams<SampleData>;
    pageInfo: PageInfo;
    dataList: SampleData[];
    selectedKeys: any[];
}

type action = {
    updateState: (data: Partial<state>) => void;
}

const initField = <T>(value: T): fieldState<T> => {
    return {
        value,
        errText: ''
    }
}

export const initialState: state = {
    name: initField<string>(''),
    tagIds: initField<number[]>([]),
    startDate: initField<string>(null),
    endDate: initField<string>(null),
    orderParams: { order: 'asc', orderBy: null },
    pageInfo: {
        offset: 0,
        limit: 10,
        total: 0
    },
    dataList: [],
    selectedKeys: [],
}

export const useSampleCenterStore = create<
    state
    & action
>(set => ({
    ...initialState,
    updateState: (data) => set(() => ({ ...data }))
}))

