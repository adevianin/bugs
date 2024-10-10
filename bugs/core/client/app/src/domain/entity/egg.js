import { EventEmitter } from "@utils/eventEmitter";
import { Genome } from "./genetic/genome";
import { EggStates } from "@domain/enum/eggStates";

class Egg extends EventEmitter {

    static buildFromJson(json) {
        let genome = Genome.buildFromJson(json.genome);
        return new Egg(json.id, json.name, genome, json.progress, json.antType, json.state);
    }

    constructor(id, name, genome, progress, antType, state) {
        super();
        this.id = id;
        this.name = name;
        this.genome = genome;
        this.progress = progress;
        this.antType = antType;
        this.state = state;
    }

    get isReady() {
        return this.state == EggStates.READY;
    }

    get isDevelopment() {
        return this.state == EggStates.DEVELOPMENT;
    }

    get isSpoiled() {
        return this.state == EggStates.SPOILED;
    }

    get isFertilized() {
        return this.genome.isFertilized;
    }

    get avaliableAntTypes() {
        return this.genome.avaliableAntTypes;
    }

    updateProgress(progress, state) {
        this.progress = progress;
        this.state = state;
        this.emit('progressChanged');
    }

}

export {
    Egg
}