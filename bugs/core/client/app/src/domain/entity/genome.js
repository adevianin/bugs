class Genome {

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