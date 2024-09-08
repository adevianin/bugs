class AntApi {

    constructor(requester) {
        this._requester = requester;
    }

    flyNuptialFlight(antId) {
        return this._requester.post(`world/ants/${ antId }/fly_nuptial_flight`)
    }

    toggleGuardianBehavior(antId, isEnabled) {
        return this._requester.post(`world/ants/${ antId }/guardian_behavior`, {
            is_enabled: isEnabled
        });
    }

    toggleCooperativeBehavior(antId, isEnabled) {
        return this._requester.post(`world/ants/${ antId }/cooperative_behavior`, {
            is_enabled: isEnabled
        });
    }

    relocateToNest(antId, nestId) {
        return this._requester.post(`world/ants/${ antId }/relocate`, {
            nest_id: nestId
        });
    }
}

export {
    AntApi
}