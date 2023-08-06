class Action {

    constructor(actorId, actorType, actionType, actionData) {
        this.actorId = actorId;
        this.type = actionType;
        this.actorType = actorType;
        this.actionData = actionData;
    }

}

export {
    Action
}