import { create } from 'zustand';

export type LeftBarState = {
    selectMenu: string;
}

export const useHomeStore = create<LeftBarState>((set) => ({
    selectMenu: ''
}))