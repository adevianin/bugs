import { Action } from './action';

class ActionFactory {

    buildAction(actionJson) {
        return new Action(actionJson.actor_id, actionJson.action_type, actionJson.step_number, actionJson.action_data);
    }
}

export {
    ActionFactory
}