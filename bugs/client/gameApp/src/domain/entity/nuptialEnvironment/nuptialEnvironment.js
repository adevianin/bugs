import { EventEmitter } from "@common/utils/eventEmitter"

class NuptialEnvironment {

    constructor() {
        this.events = new EventEmitter();
        this._nuptialMales = [];
        this._specie = null;
    }

    get nuptialMales() {
        return this._nuptialMales;
    }

    setNuptialMales(males) {
        this._nuptialMales = males;
        this.events.emit('nuptialMalesChanged');
    }

    get specie() {
        return this._specie;
    }

    setSpecie(specie) {
        this._specie = specie;
        this._specie.on('specieSchemaChanged')
    }

    updateSpecieGenes(chromosomeSpecieGenes) {
        for (let chromosomeType in chromosomeSpecieGenes) {
            let specieChromosome = this._specie.getChromosomeByType(chromosomeType);
            specieChromosome.updateGenes(chromosomeSpecieGenes[chromosomeType]);
        }
        this.events.emit('specieGenesChanged');
    }
}

export {
    NuptialEnvironment
}