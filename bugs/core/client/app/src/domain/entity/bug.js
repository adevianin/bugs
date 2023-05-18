import { Entity } from './entity';
import { EntityTypes } from './entityTypes';
import { ACTION_TYPES } from './action/actionTypes';
import { distance } from 'utils/distance';

class Bug extends Entity {

    constructor(eventBus, id, position, pickedFoodId, userSpeed) {
        super(eventBus, id, position, EntityTypes.BUG);
        this.pickedFood = null;
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
            case ACTION_TYPES.WALK:
                return this._playWalkAction(action);
            case ACTION_TYPES.BUG_PICKED_UP_FOOD:
                return this._playFoodPickingAction(action);
            case ACTION_TYPES.FOOD_GAVE:
                return this._playFoodGiving(action);
            case ACTION_TYPES.EAT_FOOD:
                return this._playEatFoodAction(action);
            default:
                throw 'unknown type of action'
        }
    }

    hasPickedFood() {
        return !!this.pickedFood;
    }

    _playWalkAction(action) {
        let destPosition = action.additionalData.position;
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
            setTimeout(() => {
                this._pickupFood(action.additionalData.food);
                res();
            }, 1)
        });
    }

    _playFoodGiving(action) {
        this._setState('standing');
        return new Promise((res) => {
            setTimeout(() => {
                this._dropFood();
                res();
            }, 1)
        });
    }

    _playEatFoodAction(action) {
        this._setState('standing');
        return new Promise((res) => {
            setTimeout(() => {
                // console.log('eating');
                if (action.additionalData.is_food_eaten) {
                    action.additionalData.food.die();
                }
                res();
            }, 1)
        });
    }

    _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {
        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
        let distancePassed = distance * (flayedPercent  / 100);
        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
    }

    _lookAt(x, y) {
        this._angle = (Math.atan2(y - this.position.y, x - this.position.x) * 180 / Math.PI) + 90;
    }

    _pickupFood(food) {
        this.pickedFoodId = food.id;
        this.pickedFood = food;
        this.emit('foodPickedUp');
    }

    _dropFood() {
        this.pickedFoodId = null;
        this.pickedFood = null;
        this.emit('foodDroped')
    }

}

export { Bug }