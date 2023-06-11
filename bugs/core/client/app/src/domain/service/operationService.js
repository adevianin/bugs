class OperationService {

    constructor(operationApi) {
        this._operationApi = operationApi;
    }

    buildNewTown(position) {
        this._operationApi.buildNewTown(position);
    }
}

export {
    OperationService
}