class SpecieBuilderService {
    constructor(mainEventBus, specieBuilderApi, specieFactory) {
        this._mainEventBus = mainEventBus;
        this._specieBuilderApi = specieBuilderApi;
        this._specieFactory = specieFactory;

        this._mainEventBus.on('userLogout', this._onUserLogout.bind(this));
    }

    initBuilder(specieJson) {
        this._specie = this._specieFactory.buildSpecieFromJson(specieJson);
    }

    getMySpecie() {
        return this._specie;
    }

    _onUserLogout() {
        this._specie = null;
    }

}

export {
    SpecieBuilderService
}