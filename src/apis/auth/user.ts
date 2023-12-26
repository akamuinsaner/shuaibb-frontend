import { User } from 'declare/user';
import request from 'utils/request';

export const listUsers = (data?: any) => {
    return request(
        `/api/users/`,
        {
            method: 'GET',
            data
        }
    )
}

export const createUser = (data: User) => {
    return request(
        `/api/users/`,
        {
            method: 'POST',
            data
        }
    )
}

export const updateUser = (data: Partial<User>) => {
    return request(
        `/api/users/${data.id}/`,
        {
            method: 'PUT',
            data
        }
    )
}

export const editUser = (data: Partial<User>) => {
    return request(
        `/api/users/${data.id}/`,
        {
            method: 'PATCH',
            data
        }
    )
}

export const deleteUser = (id: number) => {
    return request(
        `/api/users/${id}/`,
        {
            method: 'DELETE'
        }
    )
}

export const batchDeleteGroup = (ids: number[]) => {
    return request(
        `/api/auths/groups/batchDelete/`,
        {
            method: 'POST',
            data: { ids }
        }
    )
}