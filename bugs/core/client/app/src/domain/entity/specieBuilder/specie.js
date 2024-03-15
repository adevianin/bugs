import { EventEmitter } from "@utils/eventEmitter";

class Specie extends EventEmitter {

    constructor(specieChromosomes) {
        super();
        this._specieChromosomes = specieChromosomes;
    }

    getChromosomeByType(type) {
        for (let chromosome of this._specieChromosomes) {
            if (chromosome.type == type) {
                return chromosome;
            }
        }
    }

    _onChromosomeChange() {
        this.emit('change');
    }

}

export {
    Specie
}