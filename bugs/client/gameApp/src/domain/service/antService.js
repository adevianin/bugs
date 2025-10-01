import { BaseGameService } from "./base/baseGameService";

class AntService extends BaseGameService {

    constructor(mainEventBus, world, commandMessenger) {
        super(mainEventBus, world);
        this._commandMessenger = commandMessenger;
    }

    async antFlyNuptialFlight(antId) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('fly_nuptial_flight', {
            ant_id: antId
        }));
    }

    async antChangeGuardianBehavior(antId, behaviorValue) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('change_ant_guardian_behavior', {
            ant_id: antId,
            behavior_value: behaviorValue
        }));
        let ant = this._world.findEntityById(antId);
        ant.guardianBehavior = behaviorValue;
    }

    async antToggleCooperativeBehavior(antId, isCooperative) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('change_ant_cooperative_behavior', {
            ant_id: antId,
            is_enabled: isCooperative
        }));
        let ant = this._world.findEntityById(antId);
        ant.isCooperativeBehavior = isCooperative;
    }

    async antRelocate(antId, homeNestId) {
        await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('relocate_ant', {
            ant_id: antId,
            nest_id: homeNestId
        }));
        let ant = this._world.findEntityById(antId);
        ant.homeNestId = homeNestId;
    }

}

export {
    AntService
}