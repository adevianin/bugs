import { throttle as lodashThrottle } from 'lodash';

function throttle(func, wait, options = {}) {
    return lodashThrottle(func, wait, options);
}

export {
    throttle
}