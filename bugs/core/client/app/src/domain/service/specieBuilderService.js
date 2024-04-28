class SpecieBuilderService {
    constructor(mainEventBus, specieBuilderApi, specieFactory) {
        this._mainEventBus = mainEventBus;
        this._specieBuilderApi = specieBuilderApi;
        this._specieFactory = specieFactory;

        this._mainEventBus.on('userLogout', this._onUserLogout.bind(this));
    }

    getMySpecie() {
        return this._specie;
    }

    initBuilder(specieJson) {
        this._specie = this._specieFactory.buildSpecieFromJson(specieJson);
        this._stopListenSpecieChange = this._specie.on('specieSchemaChanged', this._onSpecieSchemaChanged.bind(this));
    }

    _onUserLogout() {
        this._stopListenSpecieChange();
        this._specie = null;
    }

    _onSpecieSchemaChanged() {
        this._specieBuilderApi.saveSpecieSchema(this._specie);
    }

}

export {
    SpecieBuilderService
}