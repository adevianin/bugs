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
        this._stopListenSpecieChange = this._specie.on('change', this._onSpecieChanged.bind(this));
    }

    _onUserLogout() {
        this._stopListenSpecieChange();
        this._specie = null;
    }

    _onSpecieChanged() {
        this._specieBuilderApi.saveSpecie(this._specie);
    }

}

export {
    SpecieBuilderService
}