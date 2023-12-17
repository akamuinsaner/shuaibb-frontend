export type Permission = {
    name: string;
    id?: number;
    codename: string;
    chineseName: string;
    contentType?: number
}

export type Group = {
    name: string;
    id?: number;
    permissions?: Permission[];
    permissionIds?: number[];
}