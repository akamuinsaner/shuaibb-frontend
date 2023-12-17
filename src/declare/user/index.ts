import { Group } from '../auth';

export type User = {
    id?: number;
    mobile: string;
    password?: string;
    email?: string;
    username?: string;
    avatar?: string;
    role?: ERole;
    showName?: string;
    groups?: Group[]
}

export enum ERole {
    '管理员' = 0,
    '摄影师' = 1,
    '其他' = -1
}

