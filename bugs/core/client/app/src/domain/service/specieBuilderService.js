class SpecieBuilderService {
    constructor(mainEventBus, specieBuilderApi, specieFactory, specieJson) {
        this._mainEventBus = mainEventBus;
        this._specieBuilderApi = specieBuilderApi;
        this._specieFactory = specieFactory;

        this._mainEventBus.on('userLogout', this._onUserLogout.bind(this));

        this._initBuilder(specieJson);
    }

    getMySpecie() {
        return this._specie;
    }

    _initBuilder(specieJson) {
        this._specie = this._specieFactory.buildSpecieFromJson(specieJson);
    }

    _onUserLogout() {
        this._specie = null;
    }

}

export {
    SpecieBuilderService
}