import { BaseService } from "./base/baseService";

class AntService extends BaseService {

    constructor(mainEventBus, world, antApi) {
        super(mainEventBus, world);
        this._antApi = antApi;
    }

    async antFlyNuptialFlight(antId) {
        await this._requestHandler(() => this._antApi.flyNuptialFlight(antId));
    }

    async antChangeGuardianBehavior(antId, behaviorValue) {
        await this._requestHandler(() => this._antApi.changeGuardianBehavior(antId, behaviorValue));
        let ant = this._world.findEntityById(antId);
        ant.guardianBehavior = behaviorValue;
    }

    async antToggleCooperativeBehavior(antId, isCooperative) {
        await this._requestHandler(() => this._antApi.toggleCooperativeBehavior(antId, isCooperative));
        let ant = this._world.findEntityById(antId);
        ant.isCooperativeBehavior = isCooperative;
    }

    async antRelocate(antId, homeNestId) {
        await this._requestHandler(() => this._antApi.relocateToNest(antId, homeNestId));
        let ant = this._world.findEntityById(antId);
        ant.homeNestId = homeNestId;
    }

}

export {
    AntService
}