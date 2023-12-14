import { create } from 'zustand';
import dayjs from 'dayjs';
import { Schedule } from 'declare/schedule';

type Calendar = {
    date: string;
    inMonth: Boolean;
    beforeMonth: Boolean
} 

type State = {
    curViewDate: string;
    curOrderDate: string,
    orderDialogOpen: boolean;
    schedules: Schedule[];
    curAddDate: string;
    monthState: {
        year: number;
        month: number;
    };
}

type Action = {
    updateState: (data: Partial<State>) => void;
}

const initialState: State = {
    curViewDate: dayjs().format('YYYY-MM-DD'),
    curOrderDate: '',
    orderDialogOpen: false,
    schedules: [],
    monthState: {
        year: dayjs().year(),
        month: dayjs().month() + 1
    },
    curAddDate: ''
}

export const useScheduleStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))