class Action {

    constructor(entityId, actionType, time, actionData) {
        this.entityId = entityId;
        this.type = actionType;
        this.time = time;
        this.additionalData = actionData;
    }

}

export {
    Action
}