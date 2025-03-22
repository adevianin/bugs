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
        this.emit('isInHibernationChanged');
    }

    get isVisible() {
        return super.isVisible && !this._isInHibernation;
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.ENTITY_ROTATED:
                return this._playEntityRotated(action);
            case ACTION_TYPES.ENTITY_WALK:
                return this._playWalkAction(action);
            case ACTION_TYPES.ENTITY_HIBERNATION_STATUS_CHANGED:
                return this._playHibernationStatusChanged(action);
        }

        return null;
    }

    _playEntityRotated(action) {
        //without waiting rotation done
        this._requestActionAnimation(ACTION_TYPES.ENTITY_ROTATED, {
            newAngle: action.actionData.angle
        });

        return Promise.resolve();
    }

    async _playWalkAction(action) {
        let destPosition = action.position;
        this._setState('walking');
        await this._requestActionAnimation(ACTION_TYPES.ENTITY_WALK, {
            destinationPosition: destPosition,
            userSpeed: action.userSpeed
        });
        this._setState('standing');
    }

    _playHibernationStatusChanged(action) {
        this.isInHibernation = action.isInHibernation;
        return Promise.resolve();
    }

}

export {
    LiveEntity
}