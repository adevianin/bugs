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
                return this._buildEatFoodAction(actionJson);
            case ACTION_TYPES.ENTITY_BORN:
                return this._buildEntityBornAction(actionJson);
            default:
                throw `unknown type of action '${actionJson.action_type}'`
        }
    }

    _buildWalkAction(actionJson) {
        return this._buildAction(actionJson.actor_id, actionJson.action_type, actionJson.step_number, {
            position: actionJson.action_data.position
        });
    }

    _buildFoodPickedAction(actionJson) {
        let food = this._world.findEntityById(actionJson.action_data.food_id);
        if (!food) {
            throw `food not found id = ${actionJson.action_data.food_id}`
        }
        return this._buildAction(actionJson.actor_id, actionJson.action_type, actionJson.step_number, {
            food
        });
    }

    _buildEatFoodAction(actionJson) {
        let food = this._world.findEntityById(actionJson.action_data.food_id);
        return this._buildAction(actionJson.actor_id, actionJson.action_type, actionJson.step_number, {
            food,
            is_food_eaten: actionJson.action_data.is_food_eaten
        });
    }

    _buildFoodGaveAction(actionJson) {
        return this._buildAction(actionJson.actor_id, actionJson.action_type, actionJson.step_number);
    }

    _buildEntityBornAction(actionJson) {
        return this._buildAction(actionJson.actor_id, actionJson.action_type, actionJson.step_number, {
            entityJson: actionJson.action_data.entity
        });
    }

    _buildAction(actorId, actionType, stepNumber, data) {
        return new Action(actorId, actionType, stepNumber, data);
    }
}

export {
    ActionFactory
}