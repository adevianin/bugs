import axios from 'axios';
import { getCookie } from 'utils/getCookie';

class Requester {

    post(url, params) {
        return axios.post(url, params, { headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': this._readCsrfToken()
        }})
    }

    _readCsrfToken() {
        return getCookie('csrftoken');
    }
}

export {
    Requester
}