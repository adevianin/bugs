import { Entity } from './entity';

class Bug extends Entity {

    constructor(mainEventBus, id, pos, size) {
        super(mainEventBus, id, pos, size);
        this._flySpeed = 50;
    }

    updateEntity(entityJson) {
        this.flyTo(entityJson.pos.x, entityJson.pos.y);
    }

    flyTo(x, y) {
        this._clearFlying()

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
                this._clearFlying();
            }
        }, 100)
    }

    _clearFlying() {
        this._wholeFlyTime = null;
        clearInterval(this._flyingInterval);
    }

    _calcCoordForFlyedPercent(startCoord, endCoord, flayedPercent) {
        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
        let distancePassed = distance * (flayedPercent  / 100);
        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
    }

    _getNow() {
        return Date.now() / 1000;
    }

}

export { Bug }