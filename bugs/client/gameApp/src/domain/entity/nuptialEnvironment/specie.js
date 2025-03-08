import { EventEmitter } from "@common/utils/eventEmitter";

class Specie extends EventEmitter {

    constructor(specieChromosomes) {
        super();
        this._specieChromosomes = specieChromosomes;

        this._listenSpecieChromosomes();
    }

    get schema() {
        let schema = {};
        for (let chromosome of this._specieChromosomes) {
            schema[chromosome.type] = chromosome.activatedSpecieGenesIds;
        }

        return schema;
    }

    getChromosomeByType(type) {
        for (let chromosome of this._specieChromosomes) {
            if (chromosome.type == type) {
                return chromosome;
            }
        }
    }

    _listenSpecieChromosomes() {
        for (let chromosome of this._specieChromosomes) {
            chromosome.on('change', this._onChromosomeChange.bind(this));
        }
    }

    _onChromosomeChange() {
        this.emit('specieSchemaChanged');
    }

}

export {
    Specie
}