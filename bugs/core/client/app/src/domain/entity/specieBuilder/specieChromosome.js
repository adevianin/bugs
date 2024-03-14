class SpecieChromosome {

    constructor(activatedSpecieGenesIds, specieGenes) {
        this.activatedSpecieGenesIds = activatedSpecieGenesIds;
        this.specieGenes = specieGenes;
    }

    checkIsGeneActivated(specieGene) {
        let index = this.activatedSpecieGenesIds.indexOf(specieGene.id);
        return index >= 0;
    }
}

export {
    SpecieChromosome
}