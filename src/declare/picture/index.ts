import { User } from '../user';

export type PictureFolder = {
    id?: number;
    name: string;
    parent?: PictureFolder;
    parentId?: number;
    updatedAt?: string;
    children?: PictureFolder[];
    userId?: number;
    user?: User
}

export type PictureInfo = {
    id?: number;
    name: string;
    ext?: string;
    uuidName?: string;
    updatedAt?: string;
    folderId?: number;
    folder?: number;
    userId?: number;
    user?: User;
    url?: string;
    size?: number;
    width?: number;
    height?: number;

}