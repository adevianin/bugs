import { EventEmitter } from "@utils/eventEmitter";
import { AntTypes } from "@domain/enum/antTypes";

class Egg extends EventEmitter {

    constructor(id, name, genome, progress, antType) {
        super();
        this.id = id;
        this.name = name;
        this.genome = genome;
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

    get isFertilized() {
        return this.genome.isFertilized;
    }

    get avaliableAntTypes() {
        return this.genome.avaliableAntTypes;
    }

}

export {
    Egg
}