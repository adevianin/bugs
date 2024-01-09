class NuptialService {

    constructor(playerApi) {
        this._playerApi = playerApi;
    }

    searchNuptialMales() {
        return this._playerApi.searchNuptialMales();
    }


}

export {
    NuptialService
}