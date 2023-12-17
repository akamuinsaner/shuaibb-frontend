import { Group, Permission } from 'declare/auth';
import request from 'utils/request';

export const listPermissions = (data: any) => {
    return request(
        `/api/auths/permissions/`,
        {
            method: 'GET',
            data
        }
    )
}

export const createPermissions = (data: Permission) => {
    return request(
        `/api/auths/permissions/`,
        {
            method: 'POST',
            data
        }
    )
}

export const updatePermissions = (data: Permission) => {
    return request(
        `/api/auths/permissions/${data.id}/`,
        {
            method: 'PUT',
            data
        }
    )
}

export const deletePermissions = (id: number) => {
    return request(
        `/api/auths/permissions/${id}/`,
        {
            method: 'DELETE'
        }
    )
}

export const batchDeletePermission = (ids: number[]) => {
    return request(
        `/api/auths/permissions/batchDelete/`,
        {
            method: 'POST',
            data: { ids }
        }
    )
}

export const listContentTypes = () => {
    return request(
        `/api/auths/contentTypes/`
    )
}