class SpecieBuilderApi {

    constructor(requester) {
        this._requester = requester;
    }

    loadBuilderData() {
        return this._requester.get('world/nuptial_environment/specie_builder').then((response) => {
            return {
                geneEntries: response.data.geneEntries,
                schema: response.data.schema
            };
        });
    }
    
}

export {
    SpecieBuilderApi
}