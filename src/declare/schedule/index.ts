import { User } from '../user';
import { SampleData } from '../sample';
import { Customer } from '../customer';

export enum PayStatus {
    '未付款',
    '已付定金',
    '已付全款'
}

export enum PayStatusColors {
    '#F1ED8E',
    '#B0E5A5',
    '#FFB6C1',
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
}