import { Entity } from './entity';
import { EntityTypes } from './entityTypes';
import { ACTION_TYPES } from './action/actionTypes';

class Bug extends Entity {

    constructor(eventBus, id, position) {
        super(eventBus, id, position, EntityTypes.BUG);
        this.pickedFood = null;
    }

    updateEntity(entityJson) {
    }

    getColor() {
        // return this._homeTown.getColor()
    }

    playAction(action) {
        switch (action.type) {
            case ACTION_TYPES.WALK:
                return this._playWalkAction(action);
            case ACTION_TYPES.FOOD_PICKED:
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
        let wholeWalkTime = action.time * 1000;
        let walkStartAt = Date.now();
        let destPosition = action.additionalData.position;
        let startPosition = this.position;
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
        return new Promise((res) => {
            setTimeout(() => {
                this.pickedFood = action.additionalData.food;
                this.pickedFood.die();
                this.emit('onFoodLift');
                res();
            }, action.time * 1000)
        });
    }

    _playFoodGiving(action) {
        return new Promise((res) => {
            setTimeout(() => {
                this.pickedFood = null;
                this.emit('onFoodDrop')
                res();
            }, action.time * 1000)
        });
    }

    _playEatFoodAction(action) {
        return new Promise((res) => {
            setTimeout(() => {
                if (action.additionalData.is_food_eaten) {
                    action.additionalData.food.die();
                }
                res();
            }, action.time * 1000)
        });
    }

    _calcCoordForWalkedPercent(startCoord, endCoord, flayedPercent) {
        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
        let distancePassed = distance * (flayedPercent  / 100);
        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
    }

}

export { Bug }