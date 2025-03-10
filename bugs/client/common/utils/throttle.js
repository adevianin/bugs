function throttle(func, wait) {
    let lastCall = 0;

    return function(...args) {
        const now = new Date().getTime();

        if (now - lastCall >= wait) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

export {
    throttle
}