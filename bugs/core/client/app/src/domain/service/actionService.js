class ActionService {

    constructor(stepTime, actionFactory, worldService) {
        this._actionFactory = actionFactory;
        this._worldService = worldService;
        this._actionsJson = [];
        this._currentStep = null;
        this._stepTime = stepTime;
        this._is_playing_actions_turned_on = false;
    }

    turnOnPlayingActions() {
        this._is_playing_actions_turned_on = true;
    }

    playAction(actionJson) {
        if (!this._is_playing_actions_turned_on) {
            console.log('waiting sync step');
            return;
        }

        let action = this._actionFactory.buildAction(actionJson);

        switch(action.type) {
            case 'entity_born':
                this._worldService.giveBirthToEntity(action.actionData.entity)
                break;
            default:
                let actor = this._worldService.world.findEntityById(action.actorId);
                actor.addAction(action);
        }
    }

}

export {
    ActionService
}