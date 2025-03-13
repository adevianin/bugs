function getQueryParams() {
    let params = {};
    let queryString = window.location.search;

    if (queryString) {
        let urlParams = new URLSearchParams(queryString);

        urlParams.forEach((value, key) => {
            params[key] = value;
        });
    }

    return params;
}

export {
    getQueryParams
}
