import { EventEmitter } from "@common/utils/eventEmitter";

class SpecieChromosome extends EventEmitter {

    constructor(type, activatedSpecieGenesIds, specieGenes) {
        super();
        this.type = type;
        this.activatedSpecieGenesIds = activatedSpecieGenesIds;
        this.specieGenes = specieGenes;
    }

    updateGenes(specieGenes) {
        this.specieGenes = specieGenes;
        this.emit('specieGenesUpdated');
    }

    checkIsGeneActivated(specieGeneId) {
        let index = this.activatedSpecieGenesIds.indexOf(specieGeneId);
        return index >= 0;
    }

    activateSpecieGene(activatingSpecieGene) {
        let specieGeneToDeactivating = this._getActivatedSpecieGeneByType(activatingSpecieGene.gene.type);
        this.activatedSpecieGenesIds.push(activatingSpecieGene.id);
        this.emit('specieGeneActiveStatusChanged', activatingSpecieGene);
        if (specieGeneToDeactivating) {
            this._executeSpecieGeneDeactivation(specieGeneToDeactivating);
            this.emit('specieGeneActiveStatusChanged', specieGeneToDeactivating);
        }
        this.emit('change');
    }

    deactivateSpecieGene(specieGene) {
        this._executeSpecieGeneDeactivation(specieGene)
        this.emit('specieGeneActiveStatusChanged', specieGene);
        this.emit('change');
    }

    _executeSpecieGeneDeactivation(specieGene) {
        let index = this.activatedSpecieGenesIds.indexOf(specieGene.id);
        this.activatedSpecieGenesIds.splice(index, 1);
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