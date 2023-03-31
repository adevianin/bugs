import { ACTION_TYPES } from "./actionTypes";
import { Action } from './action';

class ActionFactory {

    constructor(world) {
        this._world = world;
    }

    buildAction(actionJson) {
        switch (actionJson.action_type) {
            case ACTION_TYPES.WALK:
                return this._buildWalkAction(actionJson);
            case ACTION_TYPES.FOOD_PICKED:
                return this._buildFoodPickedAction(actionJson);
            case ACTION_TYPES.FOOD_GAVE:
                return this._buildFoodGaveAction(actionJson);
            case ACTION_TYPES.EAT_FOOD:
                return this._buildEatFoodAction(actionJson)
        }
    }

    _buildWalkAction(actionJson) {
        return this._buildAction(actionJson.entity_id, actionJson.action_type, actionJson.time, {
            position: actionJson.action_data.position
        });
    }

    _buildFoodPickedAction(actionJson) {
        let food = this._world.findEntityById(actionJson.action_data.food_id);
        return this._buildAction(actionJson.entity_id, actionJson.action_type, actionJson.time, {
            food
        });
    }

    _buildEatFoodAction(actionJson) {
        let food = this._world.findEntityById(actionJson.action_data.food_id);
        return this._buildAction(actionJson.entity_id, actionJson.action_type, actionJson.time, {
            food,
            is_food_eaten: actionJson.action_data.is_food_eaten
        });
    }

    _buildFoodGaveAction(actionJson) {
        return this._buildAction(actionJson.entity_id, actionJson.action_type, actionJson.time);
    }

    _buildAction(entityId, actionType, time, data) {
        return new Action(entityId, actionType, time, data);
    }
}

export {
    ActionFactory
}