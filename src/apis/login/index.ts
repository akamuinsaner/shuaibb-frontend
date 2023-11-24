import request from 'utils/request';

export const loginAPI = (data: {
    mobile: string;
    password: string;
}) => request(
    `/api/users/login/`,
    {
        method: 'POST',
        data,
    }
)

export const signupApi = (data: {
    mobile: string;
    password: string;
    password_confirm: string
}) => request(
    `/api/users/signup/`,
    {
        method: 'POST',
        data,
    }
)

export const uInfoAPI = () => request(`/api/users/info/`)