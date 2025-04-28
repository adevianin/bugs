import { path } from "pixi.js";
import { BaseViewModel } from "./baseViewModel";
import { SpecieChromosomeViewModel } from "./specieChromosomeViewModel";

class SpecieViewModel extends BaseViewModel {

    static buildFromJson(json) {
        let specieChromosomes = [];
        for (let specieChromosomeJson of json.specieChromosomes) {
            let specieVM = SpecieChromosomeViewModel.buildFromJson(specieChromosomeJson);
            specieChromosomes.push(specieVM);
        }

        return new SpecieViewModel(specieChromosomes);
    }

    constructor(specieChromosomes) {
        super();
        this._specieChromosomes = specieChromosomes;

        this._listenSpecieChromosomes();
    }

    get specieChromosomes() {
        return this._specieChromosomes;
    }

    get schema() {
        let schema = {};
        for (let chromosome of this._specieChromosomes) {
            schema[chromosome.type] = chromosome.activatedSpecieGenesIds;
        }

        return schema;
    }

    getChromosomeByType(type) {
        return this._specieChromosomes.find(sCh => sCh.type == type);
    }

    _listenSpecieChromosomes() {
        for (let chromosome of this._specieChromosomes) {
            chromosome.on('change', this._onChromosomeChange.bind(this));
        }
    }

    _onChromosomeChange() {
        this.emit('specieSchemaChanged');
    }

    applyPatch(patch) {
        for (let specieChromosomeUpdatePatch of patch.specieChromosomes.update) {
            let specieChromosome = this.getChromosomeByType(specieChromosomeUpdatePatch.type);
            specieChromosome.applyPatch(specieChromosomeUpdatePatch);
        }
    }
}

export {
    SpecieViewModel
}