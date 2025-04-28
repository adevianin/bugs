import { BaseViewModel } from "./baseViewModel";

class SpecieChromosomeViewModel extends BaseViewModel {

    get activatedSpecieGenesIds() {
        return this._props.activatedSpecieGenesIds;
    }

    get specieGenes() {
        return this._props.specieGenes;
    }

    set specieGenes(val) {
        this._props.specieGenes = val;
        this.emit('specieGenesUpdated');
    }

    get type() {
        return this._props.type;
    }

    checkIsGeneActivated(id) {
        return this.activatedSpecieGenesIds.includes(id);
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

    _getActivatedSpecieGeneByType(type) {
        for (let specieGene of this.specieGenes) {
            if (this.checkIsGeneActivated(specieGene.id) && specieGene.gene.type == type) {
                return specieGene;
            }
        }

        return null;
    }

    applyPatch(patch) {
        this._applyProps(patch.props);
    }
}

export {
    SpecieChromosomeViewModel
}