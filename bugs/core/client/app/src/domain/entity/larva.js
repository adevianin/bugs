import { EventEmitter } from "@utils/eventEmitter";
import { Genome } from "./genetic/genome";

class Larva extends EventEmitter {

    static buildFromJson(json) {
        let genome = Genome.buildFromJson(json.genome);
        return new Larva(json.id, json.name, json.antType, json.ateFood, json.requiredFood, genome);
    }

    constructor(id, name, antType, ateFood, requiredFood, genome) {
        super();
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
        this.emit('progressChanged');
    }

}

export {
    Larva
}