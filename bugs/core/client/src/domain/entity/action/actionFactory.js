import { ACTION_TYPES } from "./actionTypes";

class ActionFactory {

    constructor(world) {
        this._world = world;
    }

    buildAction(actionJson) {
        switch (actionJson.action_type) {
            case ACTION_TYPES.WALK:
                return actionJson;
            case ACTION_TYPES.FOOD_PICKED:
                return this._buildFoodPickedAction(actionJson);
            case ACTION_TYPES.FOOD_GAVE:
                return actionJson;
        }
    }

    _buildFoodPickedAction(actionJson) {
        let food = this._world.findEntityById(actionJson.action_data.food_id);
        let action = Object.assign({}, actionJson, {
            action_data: { food }
        });

        return action;
    }
}

export {
    ActionFactory
}