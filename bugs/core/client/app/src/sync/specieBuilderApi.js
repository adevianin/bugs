class SpecieBuilderApi {

    constructor(requester) {
        this._requester = requester;
    }

    saveSpecie(specie) {
        this._requester.post('world/nuptial_environment/specie', {
            specie: {
                'body': specie.bodyChromosome.activatedSpecieGenesIds,
                'development': specie.developmentChromosome.activatedSpecieGenesIds,
                'adaptation': specie.adaptationChromosome.activatedSpecieGenesIds,
                'building': specie.buildingChromosome.activatedSpecieGenesIds,
                'combat': specie.combatChromosome.activatedSpecieGenesIds,
                'adjusting': specie.adjustingChromosome.activatedSpecieGenesIds
            }
        })
    }
    
}

export {
    SpecieBuilderApi
}