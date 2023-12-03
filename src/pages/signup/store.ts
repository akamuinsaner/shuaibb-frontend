import { create } from 'zustand';

type mobileState = {
    mobile: string;
    password: string;
    passwordConfirm: string;
    mbErrText: string;
    pwErrText: string;
    pwcfErrText: string;

}

type emailState = {
    email: string;
    password: string;
    passwordConfirm: string;
    elErrText: string;
    pwErrText: string;
    pwcfErrText: string;
}


type state = {
    loginType: 'mobile' | 'email';
    mobileState: mobileState;
    emailState: emailState;
}

type action = {
    updateState: (data: Partial<state>) => void;
    updateMobileState: (data: Partial<mobileState>) => void;
    updateEmailState: (data: Partial<emailState>) => void;
}

export const initialMobileState: mobileState = {
    mobile: '',
    password: '',
    passwordConfirm: '',
    mbErrText: '',
    pwErrText: '',
    pwcfErrText: ''
}

export const initialEmailState: emailState = {
    email: '',
    password: '',
    passwordConfirm: '',
    elErrText: '',
    pwErrText: '',
    pwcfErrText: ''
}

export const useSignupStore = create<
    state & action
>(set => ({
    loginType: 'mobile',
    mobileState: initialMobileState,
    emailState: initialEmailState,
    updateState: (data: Partial<state>) => set(() => ({ ...data })),
    updateMobileState: (data: Partial<mobileState>) => set((state) => ({ mobileState: { ...state.mobileState, ...data } })),
    updateEmailState: (data: Partial<emailState>) => set((state) => ({ emailState: { ...state.emailState, ...data } })),
}))