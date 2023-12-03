import request from 'utils/request';

export const loginAPI = (data: {
    email?: string;
    mobile?: string;
    password: string;
}) => request(
    `/api/users/login/`,
    {
        method: 'POST',
        data,
    }
)

export const signupApi = (data: {
    loginType: 'mobile' | 'email'
    mobile?: string;
    email?: string;
    password: string;
    passwordConfirm: string
}) => request(
    `/api/users/signup/`,
    {
        method: 'POST',
        data,
    }
)

export const uInfoAPI = () => request(`/api/users/info/`)