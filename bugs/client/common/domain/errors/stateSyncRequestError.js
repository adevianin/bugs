class StateSyncRequestError extends Error {
    constructor(data) {
        super();
        this.data = data;
    }

}

export {
    StateSyncRequestError
}