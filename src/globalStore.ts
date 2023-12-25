import { create } from 'zustand';
import { User } from 'declare/user';

export type state = {
    darkMode: boolean;
    token: string;
    user?: User;
    languages?: null;
    curLang?: 'ch' | 'en';
    loadCount: number;
}

export type action = {
    updateState: (data: Partial<state>)  => void
}

const token = localStorage.getItem('__token__')

const curLang: state["curLang"] = (localStorage.getItem('__lang__') || 'ch') as state["curLang"];

const useGlobalStore = create<state & action>((set) => ({
    darkMode: false,
    loadCount: 0,
    token: token,
    user: null,
    languages: null,
    curLang: curLang,
    updateState: (data) => set((state) => {
        if ('curLang' in data) localStorage.setItem('__lang__', data["curLang"])
       return {...data }
    }),
}))



export default useGlobalStore