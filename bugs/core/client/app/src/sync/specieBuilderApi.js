class SpecieBuilderApi {

    constructor(requester) {
        this._requester = requester;
    }

    saveSpecieSchema(specie) {
        this._requester.post('world/nuptial_environment/specie/specie_schema', {
            specie_schema: specie.schema
        });
    }
    
}

export {
    SpecieBuilderApi
}