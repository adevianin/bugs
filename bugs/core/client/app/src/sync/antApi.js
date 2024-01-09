class AntApi {

    constructor(requester) {
        this._requester = requester;
    }

    flyNuptialFlight(antId) {
        return this._requester.post(`world/ants/${ antId }/fly_nuptial_flight`)
    }
}

export {
    AntApi
}