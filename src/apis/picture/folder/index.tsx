import request from 'utils/request';
import { PictureFolder, PictureInfo } from 'declare/picture';

export const coverPictures = (data: any) => request(
    `/api/pictures/cover/`,
    {
        method: 'POST',
        data
    }
)

export const listPictureFolders = (data?: { id?: number }) => request(
    `/api/pictures/folders/`,
    {
        method: 'GET',
        data
    }
)

export const createPictureFolders = (data?: PictureFolder) => request(
    `/api/pictures/folders/`,
    {
        method: 'POST',
        data
    }
)

export const updatePictureFolders = (data?: Partial<PictureFolder>) => request(
    `/api/pictures/folders/${data.id}/`,
    {
        method: 'PATCH',
        data
    }
)

export const deletePictureFolders = (id: number) => request(
    `/api/pictures/folders/${id}/`,
    {
        method: 'DELETE',
    }
)

export const searchPictureAndFolder = (data: any) => request(
    `/api/pictures/search/`,
    {
        method: 'POST',
        data
    }
)

export const batchDeletePictureAndFolder = (data: any) => request(
    `/api/pictures/batchDelete/`,
    {
        method: 'POST',
        data
    }
)

export const batchMovePictureAndFolder = (data: any) => request(
    `/api/pictures/batchMove/`,
    {
        method: 'POST',
        data
    }
)

export const listPictures = (data?: any) => request(
    `/api/pictures/list/`,
    {
        method: 'POST',
        data
    }
)

export const createPictures = (data?: any) => request(
    `/api/pictures/create/`,
    {
        method: 'POST',
        data
    }
)

export const updatePicture = (data: Partial<PictureInfo>) => request(
    `/api/pictures/${data.id}/`,
    {
        method: 'PATCH',
        data
    }
)

export const deletePicture = (id: number) => request(
    `/api/pictures/${id}/`,
    {
        method: 'DELETE',
    }
)


export const getTotalSize = () => request(
    `/api/pictures/size/`,
    {
        method: 'GET'
    }
)