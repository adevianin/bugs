import { Action } from './action';

class ActionFactory {

    buildAction(actionJson) {
        return new Action(actionJson.actor_id, actionJson.actor_type, actionJson.action_type, actionJson.action_data);
    }
}

export {
    ActionFactory
}