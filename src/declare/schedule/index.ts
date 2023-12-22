import { User } from '../user';
import { SampleData } from '../sample';
import { Customer } from '../customer';
import { HistoryFields } from 'declare/common';


export enum PayStatus {
    '已关闭' = -1,
    '未付款' = 0,
    '已付定金' = 1,
    '已付全款' = 2,
    '完成拍摄' = 3,
    '完成订单' = 4
}

export enum PayStatusColors {
    '#DDDDDD' = -1,
    '#F1ED8E' = 0,
    '#B0E5A5' = 1,
    '#FFB6C1' = 2,
    '#C1B6FF' = 3,
    '#A5E5B0' = 4
}


export type Schedule = {
    customerId?: number;
    customer?: Customer;
    customerName?: string;
    customerPhone?: string;
    shootDate?: string;
    startTime?: string;
    endTime?: string;
    dateSettled?: boolean;
    sample?: SampleData;
    sampleId?: number;
    price: number;
    deposit: number;
    payStatus: PayStatus;
    location?: string;
    user?: User;
    userId?: number;
    id?: number;
    executors?: User[];
    executorIds?: number[];
    createdAt?: string;
    updatedAt?: string;
    history?: (Schedule & HistoryFields)[];
    _change_reason?: string;
}