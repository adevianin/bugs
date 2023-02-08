import { Entity } from './entity';
import { EntityTypes } from './entityTypes';

class Bug extends Entity {

    constructor(id, position) {
        super(id, position, EntityTypes.BUG);
        this._flySpeed = 50;
        this._flyPointsStack = [];
        this._isFlying = false;
    }

    updateEntity(entityJson) {
        // this.setPosition(entityJson.position.x, entityJson.position.y)
        this.flyTo(entityJson.position.x, entityJson.position.y);
        this.is_food_picked = entityJson.is_food_picked;
    }

    flyTo(x, y) {
        if (this._isFlying) {
            this._flyPointsStack.push({x,y});
            return;
        }

        this._isFlying = true;
        let distance = Math.sqrt(Math.pow(x - this.position.x, 2)+ Math.pow(y - this.position.y, 2));
        this._wholeFlyTime = distance / this._flySpeed;
        this._flyStartAt = this._getNow();
        this._flyingInterval = setInterval(() => {
            let timeInFly = this._getNow() - this._flyStartAt;
            let flayedPercent = ( 100 * timeInFly ) / this._wholeFlyTime;
            if (flayedPercent < 100) {
                let currentX = this._calcCoordForFlyedPercent(this.position.x, x, flayedPercent);
                let currentY = this._calcCoordForFlyedPercent(this.position.y, y, flayedPercent);
                this.setPosition(currentX, currentY);
            } else {
                this.setPosition(x, y);
                this._wholeFlyTime = null;
                clearInterval(this._flyingInterval);
                this._isFlying = false;
                
                this._flyToNextPoint();
            }
        }, 100)
    }

    getColor() {
        // return this._homeTown.getColor()
    }

    _flyToNextPoint() {
        if (this._flyPointsStack.length) {
            let point = this._flyPointsStack[0];
            this._flyPointsStack.shift();
            this.flyTo(point.x, point.y);
        }
    }

    _calcCoordForFlyedPercent(startCoord, endCoord, flayedPercent) {
        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
        let distancePassed = distance * (flayedPercent  / 100);
        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
    }

    _getNow() {
        return Date.now() / 1000;
    }

    _isFlying() {
        return 
    }

}

export { Bug }