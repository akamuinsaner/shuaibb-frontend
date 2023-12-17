import { Group, Permission } from 'declare/auth';
import request from 'utils/request';

export const listGroups = (data?: any) => {
    return request(
        `/api/auths/groups/`,
        {
            method: 'GET',
            data
        }
    )
}

export const createGroup = (data: Group) => {
    return request(
        `/api/auths/groups/`,
        {
            method: 'POST',
            data
        }
    )
}

export const updateGroup = (data: Group) => {
    return request(
        `/api/auths/groups/${data.id}/`,
        {
            method: 'PUT',
            data
        }
    )
}

export const deleteGroup = (id: number) => {
    return request(
        `/api/auths/groups/${id}/`,
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