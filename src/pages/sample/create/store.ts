import { create } from 'zustand';
import { SampleLabel } from 'common/types';

export type SampleNameState = {
    name: string;
    tags: SampleLabel[];
    desc: String;
    covers: string[];
    details: string[]
}

export type SamplePriceState = {
    price: number;
    priceVisible: boolean;
    deposit: number;
    depositVisible: boolean;
}

export type SampleServiceState = {
    basicInfoVisible: boolean;
    costumeOffer: boolean;
    costumeCount: number;
    customCostumeCount: number;
    negativeFilmCount: number;
    negaFilmAllOffer: boolean;
    shootingTime: number;
    customShootingTime: number
    refineCount: number;
    shootingIndoor: boolean;
    shootingSceneIndoorCount: number;
    customDetail: string;
}

export type SampleExtraState = {
    public: boolean;
    tips: string;
}

export type SampleNameAction = {
    updateSampleName: (data: Partial<SampleNameState>) => void
}

export type SamplePriceAction = {
    updateSamplePrice: (data: Partial<SamplePriceState>)  => void
}

export type SampleServiceAction = {
    updateSampleService: (data: Partial<SampleServiceState>)  => void
}

export type SampleExtraAction = {
    updateSampleExtra: (data: Partial<SampleExtraState>)  => void
}

type State = {
    activeTab: number;
    sampleName: SampleNameState;
    samplePrice: SamplePriceState;
    sampleService: SampleServiceState; 
    sampleExtra: SampleExtraState;
}

type Action = {
    updateActiveTab: (activeTab: number) => void;
}

const initialSampleName: SampleNameState = {
    name: null,
    tags: [],
    desc: null,
    covers: ['https://www.dmoe.cc/random.php', 'https://bing.ioliu.cn/v1/rand', 'https://api.dujin.org/bing/1366.php', 'https://www.loliapi.com/bg/'],
    details: ['https://www.dmoe.cc/random.php', 'https://bing.ioliu.cn/v1/rand', 'https://api.dujin.org/bing/1366.php', 'https://www.loliapi.com/bg/']
}

const initialSamplePrice: SamplePriceState = {
    price: null,
    priceVisible: true,
    deposit: null,
    depositVisible: true,
}

const initialSampleService: SampleServiceState = {
    basicInfoVisible: true,
    costumeOffer: false,
    costumeCount: null,
    customCostumeCount: null,
    negativeFilmCount: null,
    negaFilmAllOffer: false,
    shootingTime: null,
    customShootingTime: null,
    refineCount: null,
    shootingIndoor: true,
    shootingSceneIndoorCount: null,
    customDetail: null,
}

const initialSampleExtra: SampleExtraState = {
    public: true,
    tips: null,
}

export const useSampleCreateStore = create<
    State
    & Action
    & SampleNameAction
    & SamplePriceAction
    & SampleServiceAction
    & SampleExtraAction
>(set => ({
    sampleName: initialSampleName,
    samplePrice: initialSamplePrice,
    sampleService: initialSampleService,
    sampleExtra: initialSampleExtra,
    activeTab: 0,
    updateActiveTab: (activeTab) => set(() => ({ activeTab })),
    updateSampleName: (data) => set((state) => ({ sampleName: { ...state.sampleName, ...data } })),
    updateSamplePrice: (data) => set((state) => ({ samplePrice: { ...state.samplePrice, ...data } })),
    updateSampleService: (data) => set((state) => ({ sampleService: { ...state.sampleService, ...data } })),
    updateSampleExtra: (data) => set((state) => ({ sampleExtra: { ...state.sampleExtra, ...data } })),
}))