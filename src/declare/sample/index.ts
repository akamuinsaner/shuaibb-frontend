import type { User } from '../user';

export type SampleLabel = {
    id: number;
    name: string;
    parentId?: number;
    children?: SampleLabel[];
}

export type SampleData = {
    id?: number;
    userId?: number;
    user?: User;
    isDraft: boolean;
    createdAt?: string;
    updatedAt?: string;

    name: string;
    desc: string;
    tagIds?: number[];
    tags?: SampleLabel[];
    covers: string[];
    details: string[];

    price: number;
    priceVisible: boolean;
    deposit: number;
    depositVisible: boolean;

    basicInfoVisible: boolean;
    costumeOffer: boolean;
    costumeCount: number;
    customCostumeCount?: number;
    negativeFilmCount: number;
    negaFilmAllOffer: boolean;
    shootingTime: number;
    customShootingTime?: number;
    refineCount: number;
    shootingIndoor: boolean;
    shootingSceneIndoorCount: number;
    customDetail: string;

    public: boolean;
    tips: string;
}

export enum CostumeCount {
    '1套' = 1,
    '2套' = 2,
    '3套' = 3,
    '4套' = 4,
    '5套' = 5,
}

export enum ShootingTime {
    '半小时' = 0.5,
    '1小时' = 1,
    '2小时' = 2,
    '4小时' = 4,
    '8小时' = 8
}

export type SampleTemplate = {
    id?: number;
    userId?: number;
    user?: User;
    name?: string;
    basicInfoVisible: boolean;
    costumeOffer: boolean;
    costumeCount: number;
    customCostumeCount?: number;
    negativeFilmCount: number;
    negaFilmAllOffer: boolean;
    shootingTime: number;
    customShootingTime?: number;
    refineCount: number;
    shootingIndoor: boolean;
    shootingSceneIndoorCount: number;
}