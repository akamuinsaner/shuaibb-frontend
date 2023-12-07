import { create } from 'zustand';
import { PictureFolder, PictureInfo } from 'declare/picture';

export enum ESortMethod {
    name_asc,
    name_desc,
    date_asc,
    date_desc
}

export type state = {
    folders: PictureFolder[];
    formatedFolders: { [name: string]: PictureFolder }
    idChildrenFolders: Map<any, PictureFolder[]>;
    createFolderDialogOpen: boolean;
    defaultSelectId: any;
    folderIds: any[];
    pictures: PictureInfo[];
    showMode: 'list' | 'grid';
    sortMethod: ESortMethod;
    searchedData: {
        folders: PictureFolder[];
        pictures: PictureInfo[];
    }
}

type action = {
    updateState: (data: Partial<state>) => void;
}

export const initialState: state = {
    folders: [],
    formatedFolders: {},
    idChildrenFolders: new Map(),
    createFolderDialogOpen: false,
    defaultSelectId: null,
    folderIds: [0, null],
    pictures: [],
    showMode: 'grid',
    sortMethod: null,
    searchedData: null
}

export const usePictureStore = create<
    state
    & action
>(set => ({
    ...initialState,
    updateState: (data) => set(() => ({ ...data }))
}))
