import { DEVHOST } from 'common/contants';

const HOST = DEVHOST;

type options = {
    method?: string;
    data?: any;
}

let headers = {
    "content-type": "application/json",
}

export default (url: string, {
    method,
    data
}: options = {
    method: 'GET',
    data: {}
}) => {
    const token = localStorage.getItem("__token__");
    if (token) {
        headers = Object.assign({}, headers, { Authorization: `Token ${token}` })
    }
    return fetch(`${HOST}${url}`, {
        method,
        body: method === 'GET' ? null : JSON.stringify(data),
        headers 
    }).then((res) => {
        return res.json();
    }).then(res => {
        if (res.code === 0) {
            return res.data;
        } else {
            throw(new Error(res.message))
        }
    })
}