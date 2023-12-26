import { create } from 'zustand';
import { User, ERole } from 'declare/user';


type State = {

}

type Action = {
    updateState: (data: Partial<State>) => void;
}


const initialState: State = {

}

export const useStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))