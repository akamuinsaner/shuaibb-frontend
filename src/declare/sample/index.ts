import type { User } from '../user';

export type SampleLabel = {
    id: number;
    name: string;
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
    tags: SampleLabel[];
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