class ActionService {

    constructor(stepTime, actionFactory, worldService) {
        this._actionFactory = actionFactory;
        this._worldService = worldService;
        this._actionsJson = [];
        this._currentStep = null;
        this._stepTime = stepTime;
    }

    handleIncomeActions(incomeActionsJson) {
        this._actionsJson = this._actionsJson.concat(incomeActionsJson);
    }

    runStepCounter(startStep) {
        this._currentStep = startStep;
        setInterval(() => {
            this._playActionsForStep(this._currentStep);
            this._currentStep++;
        }, this._stepTime * 1000)
    }

    _playActionsForStep(step) {
        let stepActions = this._buildActionsForStep(step);
        this._validateActionsForStep(stepActions);
        this._clearActionsJsonForStep(step);
        stepActions.forEach((action) => {
            this._playAction(action);
        });
    }

    _playAction(action) {
        switch(action.type) {
            case 'entity_born':
                this._worldService.giveBirthToEntity(action.actionData.entity)
                break;
            default:
                let actor = this._worldService.world.findEntityById(action.actorId);
                actor.addAction(action);
        }
    }

    _buildActionsForStep(stepNumber) {
        let actions = [];
        this._actionsJson.forEach(actionJson => {
            if (actionJson.step_number == stepNumber) {
                let action = this._actionFactory.buildAction(actionJson);
                actions.push(action);
            }
        });

        return actions;
    }

    _clearActionsJsonForStep(stepNumber) {
        this._actionsJson = this._actionsJson.filter(actionJson => actionJson.step_number != stepNumber);
    }

    _validateActionsForStep(actions) {
        actions.forEach(action => {
            let validatingActorId = action.actorId;
            let actionsCountWithSameActorId = 0;
            actions.forEach((a) => {
                if (a.actorId == validatingActorId) {
                    actionsCountWithSameActorId++
                }
            });
            if (actionsCountWithSameActorId > 1) {
                throw 'few actions found' 
            }
        })
    }
}

export {
    ActionService
}