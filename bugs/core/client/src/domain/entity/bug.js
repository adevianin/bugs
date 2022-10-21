import { Entity } from './entity';

class Bug extends Entity {

    constructor(id, pos, size, walkSpeed, destination) {
        super(id, pos, size);
        this._walkSpeed = walkSpeed;
        this._destination = destination;

        if (this.isWalking()) {
            this._startWalking();
        }
    }

    updateEntity(entityJson) {
        this.setPosition(entityJson.pos.x, entityJson.pos.y);

        if (entityJson.destination) {
            this.setDestination(entityJson.destination.x, entityJson.destination.y);
        } else {
            this._clearWalking();
        }
    }

    setDestination(x, y) {
        this._clearWalking();
        this._destination = { x, y };
        this._startWalking();
    }

    isWalking() {
        return !!this._destination;
    }

    _startWalking() {
        console.log('start walking');
        let startPosition = {
            x: this.position.x,
            y: this.position.y,
        };
        let distance = Math.sqrt(Math.pow(this.position.x - this._destination.x, 2)+ Math.pow(this.position.y - this._destination.y, 2));
        this._wholeTimeToWalk = distance / this._walkSpeed;
        this._walkStartAt = this._getNow();
        this._walkingInterval = setInterval(() => {
            let timeInWalk = this._getNow() - this._walkStartAt;
            let walkedPercent = ( 100 * timeInWalk ) / this._wholeTimeToWalk;
            let currentX = this._calcCoordForWalkedPercent(startPosition.x, this._destination.x, walkedPercent);
            let currentY = this._calcCoordForWalkedPercent(startPosition.y, this._destination.y, walkedPercent);
            this.setPosition(currentX, currentY);
        }, 100);
    }

    _clearWalking() {
        console.log('clear walking');
        this._destination = null;
        this._wholeTimeToWalk = null;
        clearInterval(this._walkingInterval);
    }

    _calcCoordForWalkedPercent(startCoord, endCoord, walkedPercent) {
        let distance = Math.abs(Math.abs(endCoord) - Math.abs(startCoord));
        let distancePassed = distance * (walkedPercent  / 100);
        return endCoord > startCoord ? startCoord + distancePassed : startCoord - distancePassed;
    }

    _getNow() {
        return Date.now() / 1000;
    }

}

export { Bug }