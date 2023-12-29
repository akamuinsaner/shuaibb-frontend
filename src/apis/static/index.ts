import request from 'utils/request';

export const languages = () => request(
    `/api/static/language/`,
    {
        method: 'GET',
        camelize: false,
    }
)

export const areas = () => request(
    `/api/static/areas/`,
    {
        method: 'GET',
        camelize: false,
    }
)