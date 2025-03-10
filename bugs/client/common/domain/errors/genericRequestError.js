class GenericRequestError extends Error {

    constructor(data) {
        super();
        this.data = data;
    }

}

export {
    GenericRequestError
}