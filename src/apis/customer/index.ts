import { Customer } from 'declare/customer';
import request from 'utils/request';

export const listCustomers = (data?: any) => request(
    `/api/customers/`,
    {
        method: 'GET',
        data
    }
)

export const createCustomer = (data: Customer) => request(
    `/api/customers/`,
    {
        method: 'POST',
        data
    }
)

export const updateCustomer = (data: Customer) => request(
    `/api/customers/${data.id}`,
    {
        method: 'PUT',
        data
    }
)

export const deleteCustomer = (id: number) => request(
    `/api/customers/${id}`,
    {
        method: 'DELETE'
    }
)

export const batchDeleteCustomers = (ids: number[]) => request(
    `/api/customers/batchDelete/`,
    {
        method: 'POST',
        data: { ids }
    }
)