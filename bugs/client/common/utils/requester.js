import axios from 'axios';
import { getCookie } from '@common/utils/getCookie';

class Requester {

    setCsrfToken(token) {
        this._csrftoken = token;
    }

    post(url, params) {
        return new Promise((res, rej) => {
            axios.post(url, params, { headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': this._readCsrfToken()
            }})
            .then(axiosResponse => {res(this._buildResultFromAxiosResponse(axiosResponse))})
            .catch(axiosError => {rej(this._buildResultFromAxiosError(axiosError))})
        });
    }

    get(url, params) {
        return new Promise((res, rej) => {
            axios.get(url, params, { headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': this._readCsrfToken()
            }})
            .then(axiosResponse => {res(this._buildResultFromAxiosResponse(axiosResponse))})
            .catch(axiosError => {rej(this._buildResultFromAxiosError(axiosError))})
        }) 
    }

    _readCsrfToken() {
        return this._csrftoken || getCookie('csrftoken');
    }

    _buildResultFromAxiosResponse(axiosResponse) {
        return {
            status: axiosResponse.status,
            data: axiosResponse.data
        }
    }

    _buildResultFromAxiosError(axiosError) {
        return {
            status: axiosError.response ? axiosError.response.status : null,
            data: axiosError.response ? axiosError.response.data : null
        }
    }
}

export {
    Requester
}