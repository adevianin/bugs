class OperationService {

    constructor(operationApi) {
        this._operationApi = operationApi;
    }

    buildNewNest(position) {
        this._operationApi.buildNewNest(position);
    }
}

export {
    OperationService
}