import { Entity } from './entity';
import { EntityTypes } from '../enum/entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { distance } from 'utils/distance';

class Ant extends Entity {

    constructor(eventBus, id, position, pickedFoodId, userSpeed) {
        super(eventBus, id, position, EntityTypes.ANT);
        this.pickedFoodId = pickedFoodId;
        this._angle = 0;
        this._userSpeed = userSpeed;
        this._setState('standing');
    }

    get angle() {
        return this._angle;
    }

    getColor() {
        // return this._homeTown.getColor()
    }

    playAction(action) {
        switch (action.type) {
            case ACTION_TYPES.ENTITY_WALK:
                return this._playWalkAction(action);
            case ACTION_TYPES.ANT_PICKED_UP_FOOD:
                return this._playFoodPickingAction(action);
            case ACTION_TYPES.ANT_GAVE_PICKED_FOOD:
                return this._playFoodGiving(action);
            case ACTION_TYPES.ENTITY_EAT_FOOD:
                return this._playEatFoodAction(action);
            default:
                throw 'unknown type of action'
        }
    }

    hasPickedFood() {
        return !!this.pickedFoodId;
    }

    _playWalkAction(action) {
        let destPosition = action.actionData.position;
        let dist = distance(this.position.x, this.position.y, destPosition.x, destPosition.y);
        let wholeWalkTime = (dist / this._userSpeed) * 1000;
        let walkStartAt = Date.now();
        let startPosition = this.position;
        this._lookAt(destPosition.x, destPosition.y);
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
                    clearInterval(walkInterval);
                    res();
                }
            }, 50)
        });
    }

    _playFoodPickingAction(action) {
        this._setState('standing');
        return new Promise((res) => {
            this.pickedFoodId = action.actionData.food_id;
            this.emit('foodPickedUp');
            res();
        });
    }

    _playFoodGiving(action) {
        this._setState('standing');
        return new Promise((res) => {
            this.pickedFoodId = null;
            this.emit('foodDroped')
            res();
        });
    }

    _playEatFoodAction(action) {
        this._setState('standing');
        return Promise.resolve();
    }

    _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {
        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
        let distancePassed = distance * (flayedPercent  / 100);
        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
    }

    _lookAt(x, y) {
        this._angle = (Math.atan2(y - this.position.y, x - this.position.x) * 180 / Math.PI) + 90;
    }

}

export { Ant }