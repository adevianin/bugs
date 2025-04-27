class ChromosomesSet {
    constructor(chromosomes) {
        this._chromosomes = chromosomes;
    }

    get chromosomes() {
        return this._chromosomes;
    }

    getChromosomeByType(type) {
        for (let chromosome of this._chromosomes) {
            if (chromosome.type == type) {
                return chromosome;
            }
        }
    }
}

export {
    ChromosomesSet
}