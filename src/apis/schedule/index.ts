import request from 'utils/request';
import { Schedule } from 'declare/schedule';

export const listSchedules = (data: any) => request(
    `/api/schedules/`,
    {
        method: 'GET',
        data
    }
)

export const createSchedule = (data: Schedule) => request(
    `/api/schedules/`,
    {
        method: 'POST',
        data
    }
)

export const updateSchedule = (data: Partial<Schedule>) => request(
    `/api/schedules/${data.id}/`,
    {
        method: 'PATCH',
        data
    }
)

export const deleteSchedule = (id: number) => request(
    `/api/schedules/${id}`,
    {
        method: 'DELETE'
    }
)

export const retriveSchedule = (id: number) => request(
    `/api/schedules/${id}/`,
)

export const listHistories = (id: number) => request(
    `/api/schedules/${id}/history/`,
)