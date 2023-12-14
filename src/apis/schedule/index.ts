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