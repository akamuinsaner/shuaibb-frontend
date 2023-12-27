import { HOST } from 'common/contants';
import camelcaseKeys from 'camelcase-keys';
import decamelizeKeys from 'decamelize-keys';
import { objToStr } from './funcTools';
import { message } from 'components/globalMessage';

type options = {
    method?: string;
    data?: any;
    deCamelize?: boolean
    camelize?: boolean
}

let defaultHeaders = {
    "content-type": "application/json",
}


const getBody = (data: any, deCamelize: boolean) => {
    if (data instanceof FormData) {
        return data;
    } else {
        return JSON.stringify(
            deCamelize
                ? decamelizeKeys(data, { deep: true })
                : data)
    }
}

const getHeaders = (data: any) => {
    let headers = defaultHeaders;
    const token = localStorage.getItem("__token__");
    if (token) {
        headers = Object.assign({}, defaultHeaders, { Authorization: `Token ${token}` })
    }
    if (data instanceof FormData) {
        delete headers['content-type']
    }
    return headers;
}

export default (url: string, {
    method = 'GET',
    data,
    deCamelize = true,
    camelize = true
}: options = {
        method: 'GET',
        data: {},
        deCamelize: true,
        camelize: true
    }) => {

    if (method === 'GET' && data) {
        url = `${url}${objToStr(data)}`
    }
    return fetch(`${HOST}${url}`, {
        method,
        body: method === 'GET' ? null : getBody(data, deCamelize),
        headers: getHeaders(data)
    }).then((res) => {
        return res.json();
    }).then(res => {
        if (res.code === 0) {
            return camelize ? camelcaseKeys(res.data, { deep: true }) : res.data;
        } else {
            message.error(res.message);
            throw (new Error(res.message))
        }
    })
}