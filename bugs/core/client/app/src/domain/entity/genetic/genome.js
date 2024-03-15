import { ChromosomesSet } from "./chromosomesSet";

class Genome {

    static buildFromJson(json) {
        let maternalChromosomesSet = new ChromosomesSet(json.maternal);
        let paternalChromosomesSet = json.paternal ? new ChromosomesSet(json.paternal) : null;
        return new Genome(maternalChromosomesSet, paternalChromosomesSet, json.avaliableAntTypes);
    }

    constructor(maternal, paternal, avaliableAntTypes) {
        this._maternal = maternal;
        this._paternal = paternal;
        this._avaliableAntTypes = avaliableAntTypes;
    }
    
    get maternal() {
        return this._maternal;
    }
    
    get paternal() {
        return this._paternal;
    }
    
    get avaliableAntTypes() {
        return this._avaliableAntTypes;
    }

    get isFertilized() {
        return !!this._paternal;
    }

}

export {
    Genome
}