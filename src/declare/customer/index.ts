import { User } from '../user';

export type Customer = {
    name: string;
    phone: string;
    avatar?: string;
    desc?: string;
    user?: User;
    userId?: number;
    id?: number;
}