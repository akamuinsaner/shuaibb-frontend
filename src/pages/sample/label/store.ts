import { create } from 'zustand';
import { SampleLabel } from 'declare/sample';
import { PageInfo } from 'components/ListTable';

type State = {
    filterParams: { [name: string]: any };
    pageInfo: PageInfo;
    selectKeys: number[];
    curEditRecord: SampleLabel;
    createDialogOpen: boolean;
    labels: SampleLabel[];
    allLabels: SampleLabel[];
}

type Action = {
    updateState: (data: Partial<State>) => void;
}


const initialState: State = {
    filterParams: {},
    selectKeys: [],
    curEditRecord: null,
    createDialogOpen: false,
    labels: [],
    allLabels: [],
    pageInfo: {
        offset: 0,
        limit: 15,
        total: 0
    }
}

export const useStore = create<
    State & Action
>(set => ({
    ...initialState,
    updateState: (data: Partial<State>) => set(() => ({ ...data })),
}))