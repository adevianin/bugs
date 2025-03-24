import { Entity } from "./entity"
import { ACTION_TYPES } from './action/actionTypes';

class LiveEntity extends Entity {

    constructor(eventBus, id, position, angle, entityType, fromColony, ownerId, hp, maxHp, isInHibernation) {
        super(eventBus, id, position, angle, entityType, fromColony, ownerId, hp, maxHp);
        this._isInHibernation = isInHibernation;
    }

    get isInHibernation() {
        return this._isInHibernation;
    }

    set isInHibernation(val) {
        this._isInHibernation = val;
    }

    get isVisible() {
        return super.isVisible && !this._isInHibernation;
    }

    playAction(action) {
        let isPlayed = super.playAction(action);
        if (isPlayed) {
            return true;
        }

        switch (action.type) {
            case ACTION_TYPES.ENTITY_ROTATED:
                this._playEntityRotated(action);
                return true;
            case ACTION_TYPES.ENTITY_WALK:
                this._playWalkAction(action);
                return true;
            case ACTION_TYPES.ENTITY_HIBERNATION_STATUS_CHANGED:
                this._playHibernationStatusChanged(action);
                return true;
            default:
                return false;
        }
    }

    _playEntityRotated(action) {
        this._requestActionAnimation(ACTION_TYPES.ENTITY_ROTATED, {
            startAngle: this.angle,
            newAngle: action.actionData.angle
        });
        this.angle = action.actionData.angle;
    }

    _playWalkAction(action) {
        this._requestActionAnimation(ACTION_TYPES.ENTITY_WALK, {
            pointFrom: this.position,
            pointTo: action.position,
            userSpeed: action.userSpeed
        });
        this.setPosition(action.position.x, action.position.y);
    }

    _playHibernationStatusChanged(action) {
        this.isInHibernation = action.isInHibernation;
        this._requestActionAnimation(ACTION_TYPES.ENTITY_HIBERNATION_STATUS_CHANGED, {
            isEntityVisibleAfter: this.isVisible
        });
    }

}

export {
    LiveEntity
}