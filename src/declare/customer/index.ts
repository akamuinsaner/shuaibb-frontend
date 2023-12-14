import { User } from '../user';

export type Customer = {
    name: string;
    phone: string;
    user?: User;
    useId?: number;
    id?: number;
}