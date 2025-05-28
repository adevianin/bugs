import { debounce as lodashDebounce } from 'lodash';

function debounce(func, wait, options = {}) {
    return lodashDebounce(func, wait, options);
}

export {
    debounce
}