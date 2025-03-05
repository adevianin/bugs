class AntApi {

    constructor(requester) {
        this._requester = requester;
    }

    flyNuptialFlight(antId) {
        return this._requester.post(`api/world/ants/${ antId }/fly_nuptial_flight`);
    }

    changeGuardianBehavior(antId, behaviorValue) {
        return this._requester.post(`api/world/ants/${ antId }/guardian_behavior`, {
            guaridan_behavior: behaviorValue
        });
    }

    toggleCooperativeBehavior(antId, isEnabled) {
        return this._requester.post(`api/world/ants/${ antId }/cooperative_behavior`, {
            is_enabled: isEnabled
        });
    }

    relocateToNest(antId, nestId) {
        return this._requester.post(`api/world/ants/${ antId }/relocate`, {
            nest_id: nestId
        });
    }
}

export {
    AntApi
}