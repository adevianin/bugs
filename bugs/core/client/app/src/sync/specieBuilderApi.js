class SpecieBuilderApi {

    constructor(requester) {
        this._requester = requester;
    }

    loadSpecieData() {
        return this._requester.get('world/nuptial_environment/specie').then((response) => {
            return response.data;
        });
    }
    
}

export {
    SpecieBuilderApi
}