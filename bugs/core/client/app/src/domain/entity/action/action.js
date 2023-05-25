class Action {

    constructor(actorId, actionType, stepNumber, actionData) {
        this.actorId = actorId;
        this.type = actionType;
        this.stepNumber = stepNumber;
        this.actionData = actionData;
    }

}

export {
    Action
}