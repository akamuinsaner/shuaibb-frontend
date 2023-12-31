import request from "utils/request";
import { SampleData, SampleTemplate } from 'declare/sample';

export const listSample = (data: any) => request(
    `/api/samples/list/`,
    {
        method: 'POST',
        data
    }
)

export const saveSample = (data: SampleData) => request(
    `/api/samples/create/`,
    {
        method: 'POST',
        data
    }
)

export const updateSample = (data: SampleData) => request(
    `/api/samples/update/`,
    {
        method: 'POST',
        data
    }
)

export const batchDeleteSample = (data: { ids: any[]}) => request(
    `/api/samples/batch/delete/`,
    {
        method: 'POST',
        data
    }
)

export const retriveSample = (data: { sampleId: number }) => request(
    `/api/samples/${data.sampleId}`,
    {
        method: 'GET',
    }
)

export const retriveDraft = () => request(
    `/api/samples/draft/retrive/`,
)


export const sampleLabels = () => request(
    `/api/samples/labels/`,
    {
        method: 'GET',
    }
)

export const sampleTemplatesFn = () => request(
    `/api/samples/templates/`,
    {
        method: 'GET'
    }
)

export const sampleTemplateCreateFn = (data: SampleTemplate) => request(
    `/api/samples/templates/`,
    {
        method: 'POST',
        data
    }
)

export const sampleTemplateUpdateFn = (data: Partial<SampleTemplate>) => request(
    `/api/samples/templates/${data.id}/`,
    {
        method: 'PUT',
        data
    }
)

export const sampleTemplateDeleteFn = (data: Partial<SampleTemplate>) => request(
    `/api/samples/templates/${data.id}/`,
    {
        method: 'delete',
        data
    }
)