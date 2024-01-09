class PlayerService {

    constructor(playerApi) {
        this._playerApi = playerApi;
    }

    playPlayerAction(action) {
        console.log(action);
    }

    generateNuptialMales() {
        this._playerApi.generateNuptialMales();
    }


}

export {
    PlayerService
}