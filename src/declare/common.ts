import { User } from './user';

export type HistoryFields = {
    historyChangeReason: string;
    historyId: number;
    historyUser: User;
    historyDate: string
}