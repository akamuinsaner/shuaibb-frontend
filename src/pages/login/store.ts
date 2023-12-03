import { create } from 'zustand';

type state = {
    uField: string;
    password: string;
    uFieldErrText: string;
    pwErrText: string;
}

type action = {
    updateState: (data: Partial<state>) => void;
}


export const initialState: state = {
    uField: '',
    password: '',
    uFieldErrText: '',
    pwErrText: '',
}

export const useLoginStore = create<
    state & action
>(set => ({
    ...initialState,
    updateState: (data: Partial<state>) => set(() => ({ ...data })),
}))