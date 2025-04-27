import { EventEmitter } from "@common/utils/eventEmitter";
import { Genome } from "./genetic/genome";

class Larva {

    static buildFromJson(json) {
        let genome = Genome.buildFromJson(json.genome);
        return new Larva(json.id, json.name, json.antType, json.ateFood, json.requiredFood, genome);
    }

    constructor(id, name, antType, ateFood, requiredFood, genome) {
        this.events = new EventEmitter();
        this.id = id;
        this.name = name;
        this.antType = antType;
        this._ateFood = ateFood;
        this.requiredFood = requiredFood;
        this.genome = genome;
    }

    get ateFood() {
        return this._ateFood;
    }

    set ateFood(value) {
        this._ateFood = value;
        this.events.emit('progressChanged');
    }

}

export {
    Larva
}