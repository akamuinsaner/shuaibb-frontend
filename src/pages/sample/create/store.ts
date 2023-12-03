import { create } from 'zustand';
import { SampleLabel, SampleData, SampleTemplate } from 'declare/sample';

type TemplateState = {
    dialogOpen: boolean;
    dialogType: 'create' | 'update';
    errText: string;
    nameText: string;
    curTemp: SampleTemplate;
}

type State = {
    activeTab: number;
    sample: SampleData;
    templateState: TemplateState;
}

type Action = {
    updateActiveTab: (activeTab: number) => void;
    updateSample: (data: Partial<SampleData>) => void
    updateTemplateState: (data: Partial<TemplateState>) => void
}

export const initialSample: SampleData = {
    isDraft: true,
    name: '',
    tags: [],
    desc: '',
    covers: [],
    details: [],
    price: 0,
    priceVisible: true,
    deposit: 0,
    depositVisible: true,
    basicInfoVisible: true,
    costumeOffer: false,
    costumeCount: null,
    customCostumeCount: 0,
    negativeFilmCount: 0,
    negaFilmAllOffer: false,
    shootingTime: null,
    customShootingTime: 0,
    refineCount: 0,
    shootingIndoor: true,
    shootingSceneIndoorCount: 0,
    customDetail: '',
    public: true,
    tips: '',
}

export const initialTemplateState: TemplateState = {
    dialogOpen: false,
    errText: '',
    dialogType: 'create',
    nameText: '',
    curTemp: null
}


export const useSampleCreateStore = create<
    State
    & Action
>(set => ({
    activeTab: 0,
    sample: initialSample,
    templateState: initialTemplateState,
    updateActiveTab: (activeTab) => set(() => ({ activeTab })),
    updateSample: (data) => set(state => ({ sample: { ...state.sample, ...data } })),
    updateTemplateState: (data) => set(state => ({ templateState: { ...state.templateState, ...data } }))
}))