import { EventEmitter } from "@utils/eventEmitter";

class SpecieChromosome extends EventEmitter {

    constructor(activatedSpecieGenesIds, specieGenes) {
        super();
        this.activatedSpecieGenesIds = activatedSpecieGenesIds;
        this.specieGenes = specieGenes;
    }

    checkIsGeneActivated(specieGeneId) {
        let index = this.activatedSpecieGenesIds.indexOf(specieGeneId);
        return index >= 0;
    }

    activateSpecieGene(activatingSpecieGene) {
        let specieGeneToDeactivating = this._getActivatedSpecieGeneByType(activatingSpecieGene.gene.type);
        this.activatedSpecieGenesIds.push(activatingSpecieGene.id);
        this._emitSpecieGeneChanged(activatingSpecieGene);
        if (specieGeneToDeactivating) {
            this.deactivateSpecieGene(specieGeneToDeactivating);
        }
    }

    deactivateSpecieGene(specieGene) {
        let index = this.activatedSpecieGenesIds.indexOf(specieGene.id);
        this.activatedSpecieGenesIds.splice(index, 1);
        this._emitSpecieGeneChanged(specieGene);
    }

    _emitSpecieGeneChanged(specieGene) {
        this.emit('specieGeneActivatingChanged', specieGene);
    }

    getSpecieGeneById(id) {
        for (let specieGene of this.specieGenes) {
            if (specieGene.id == id) {
                return specieGene;
            }
        }

        return null;
    }

    _getActivatedSpecieGeneByType(type) {
        for (let specieGene of this.specieGenes) {
            if (this.checkIsGeneActivated(specieGene.id) && specieGene.gene.type == type) {
                return specieGene;
            }
        }

        return null;
    }
}

export {
    SpecieChromosome
}