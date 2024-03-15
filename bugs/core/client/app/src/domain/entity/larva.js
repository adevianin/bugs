import { EventEmitter } from "@utils/eventEmitter";
import { Genome } from "./genetic/genome";

class Larva extends EventEmitter {

    static buildFromJson(json) {
        let genome = Genome.buildFromJson(json.genome);
        return new Larva(json.id, json.name, json.antType, json.progress, genome);
    }

    constructor(id, name, antType, progress, genome) {
        super();
        this.id = id;
        this.name = name;
        this.antType = antType;
        this._progress = progress;
        this.genome = genome;
    }

    get progress() {
        return this._progress;
    }

    set progress(value) {
        this._progress = value;
        this.emit('progressChanged');
    }

}

export {
    Larva
}