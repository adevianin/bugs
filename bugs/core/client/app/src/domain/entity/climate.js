import { EventEmitter } from "@utils/eventEmitter";

class Climate extends EventEmitter {

    constructor() {
        super();
    }

    get dailyTemperature() {
        return this._dailyTemp;
    }

    get changeDirection() {
        return this._changeDirection;
    }

    setTemperatureChange(dailyTemp, changeDirection) {
        this._dailyTemp = dailyTemp;
        this._changeDirection = changeDirection;
        this.emit('change');
    }

    playAction(action) {
        switch(action.type) {
            case 'climate_temperature_change':
                this._playTemperatureChangeAction(action);
        }
    }

    _playTemperatureChangeAction(action) {
        this.setTemperatureChange(action.dailyTemperature, action.changeDirection);
    }
}

export {
    Climate
}