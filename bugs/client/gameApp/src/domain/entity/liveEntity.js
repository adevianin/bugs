import { Entity } from "./entity"
import { distance } from '@utils/distance';
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
            case ACTION_TYPES.ENTITY_WALK:
                return this._playWalkAction(action);
            case ACTION_TYPES.ENTITY_HIBERNATION_STATUS_CHANGED:
                return this._playHibernationStatusChanged(action);
        }

        return null;
    }

    _calcWalkAnimationTimeReducer() {
        let walkActionsCount = 0;
        for (let action of this._actionStack) {
            if (action.type == ACTION_TYPES.ENTITY_WALK) {
                walkActionsCount++;
            }
        }
        switch(walkActionsCount) {
            case 0:
                return 0.97;
            case 1:
                return 0.7;
            case 2:
                return 0.5;
            case 3:
                return 0.4;
            default:
                return 0.2;
        }
    }

    _playWalkAction(action) {
        let destPosition = action.position;
        let dist = distance(this.position.x, this.position.y, destPosition.x, destPosition.y);
        let walkTimeReducer = this._calcWalkAnimationTimeReducer();
        let wholeWalkTime = (dist / action.userSpeed) * 1000 * walkTimeReducer;
        let walkStartAt = Date.now();
        let startPosition = this.position;
        this._setState('walking');
        return new Promise((res, rej) => {
            let walkInterval = setInterval(() => {
                let timeInWalk = Date.now() - walkStartAt;
                let walkedPercent = ( 100 * timeInWalk ) / wholeWalkTime;
                if (walkedPercent < 100) {
                    let currentX = this._calcCoordForWalkedPercent(startPosition.x, destPosition.x, walkedPercent);
                    let currentY = this._calcCoordForWalkedPercent(startPosition.y, destPosition.y, walkedPercent);
                    this.setPosition(currentX, currentY);
                } else {
                    this.setPosition(destPosition.x, destPosition.y);
                    this._setState('standing');
                    clearInterval(walkInterval);
                    res();
                }
            }, 50)
        });
    }

    _playHibernationStatusChanged(action) {
        this.isInHibernation = action.isInHibernation;
        return Promise.resolve();
    }

    _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {
        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
        let distancePassed = distance * (flayedPercent  / 100);
        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
    }
}

export {
    LiveEntity
}