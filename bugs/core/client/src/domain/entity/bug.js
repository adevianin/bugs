import { Entity } from './entity';
import { EntityTypes } from './entityTypes';
import { ACTION_TYPES } from './action/actionTypes';

class Bug extends Entity {

    constructor(id, position) {
        super(id, position, EntityTypes.BUG);
        this.pickedFood = null;
    }

    updateEntity(entityJson) {
    }

    getColor() {
        // return this._homeTown.getColor()
    }

    playAction(action) {
        switch (action.action_type) {
            case ACTION_TYPES.WALK:
                return this._playWalkAction(action);
            case ACTION_TYPES.FOOD_PICKED:
                return this._playFoodPickingAction(action);
            case ACTION_TYPES.FOOD_GAVE:
                return this._playFoodGiving(action);
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
        let destPosition = action.action_data.position;
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
            }, 100)
        });
    }

    _playFoodPickingAction(action) {
        return new Promise((res) => {
            setTimeout(() => {
                this.pickedFood = action.action_data.food;
                this.pickedFood.toggleHidden(true);
                res();
            }, action.time * 1000)
        });
    }

    _playFoodGiving(action) {
        console.log(123)
        return new Promise((res) => {
            setTimeout(() => {
                this.pickedFood = null;
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