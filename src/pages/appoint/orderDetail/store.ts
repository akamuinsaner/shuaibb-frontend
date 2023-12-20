import { create } from 'zustand';
import dayjs from 'dayjs';
import { Schedule } from 'declare/schedule';

type State = {
    editDialogOpen: string;

}

type Action = {
    updateState: (data: Partial<State>) => void;
}

const initialState: State = {
    editDialogOpen: null
}

export const useOrderDetailStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))