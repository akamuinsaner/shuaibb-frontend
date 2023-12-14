import request from 'utils/request';

export const listCustomers = () => request(
    `/api/customers/`,
    {
        method: 'GET'
    }
)