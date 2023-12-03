import request from 'utils/request';

export const uploadFileCommon = (data: any) => request(
    `/api/upload/common/cos/`,
    {
        method: 'POST',
        data
    }
)