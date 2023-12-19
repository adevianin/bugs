import { Entity } from "./entity"
import { distance } from '@utils/distance';
import { ACTION_TYPES } from './action/actionTypes';

class LiveEntity extends Entity {

    constructor(eventBus, id, position, angle, entityType, fromColony, userSpeed, hp, maxHp) {
        super(eventBus, id, position, angle, entityType, fromColony, hp, maxHp);
        this._userSpeed = userSpeed;
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.ENTITY_WALK:
                return this._playWalkAction(action);
        }

        return null;
    }

    _playWalkAction(action) {
        let destPosition = action.actionData.position;
        let dist = distance(this.position.x, this.position.y, destPosition.x, destPosition.y);
        let wholeWalkTime = (dist / this._userSpeed) * 1000;
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

    _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {
        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
        let distancePassed = distance * (flayedPercent  / 100);
        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
    }
}

export {
    LiveEntity
}