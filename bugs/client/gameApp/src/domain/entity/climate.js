import { EventEmitter } from "@common/utils/eventEmitter";

class Climate extends EventEmitter {

    constructor() {
        super();
    }

    get dailyTemperature() {
        return this._dailyTemp;
    }

    get directionOfChange() {
        return this._directionOfChange;
    }

    setTemperatureChange(dailyTemp, directionOfChange) {
        this._dailyTemp = dailyTemp;
        this._directionOfChange = directionOfChange;
        this.emit('change');
    }

    playAction(action) {
        switch(action.type) {
            case 'climate_temperature_change':
                this._playTemperatureChangeAction(action);
        }
    }

    _playTemperatureChangeAction(action) {
        this.setTemperatureChange(action.dailyTemperature, action.directionOfChange);
    }
}

export {
    Climate
}