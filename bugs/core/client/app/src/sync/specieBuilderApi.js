class SpecieBuilderApi {

    constructor(requester) {
        this._requester = requester;
    }

    loadBuilderData() {
        return this._requester.get('world/nuptial_environment/specie_builder').then((response) => {
            return {
                genesEntries: response.data.genesEntries,
                schema: response.data.schema
            };
        });
    }
    
}

export {
    SpecieBuilderApi
}