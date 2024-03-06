import { EventEmitter } from "@utils/eventEmitter";
import { AntTypes } from "@domain/enum/antTypes";

class Egg extends EventEmitter {

    constructor(id, name, genome, isFertilized, progress, antType) {
        super();
        this.id = id;
        this.name = name;
        this.genome = genome;
        this.isFertilized = isFertilized;
        this._progress = progress;
        this.antType = antType;
    }

    get isReady() {
        return this.progress == 100;
    }

    get progress() {
        return this._progress;
    }

    set progress(value) {
        this._progress = value;
        this.emit('progressChanged');
    }

    getAvaliableAntTypes() {
        if (this.isFertilized) {
            return [AntTypes.MALE];
        } else {
            return this.genome.getAvaliableAntTypes();
        }
    }

}

export {
    Egg
}