import { EventEmitter } from "@utils/eventEmitter";

class NuptialEnvironmentService extends EventEmitter {

    constructor(mainEventBus, nuptialEnvironmentFactory, nuptialEnvironmentApi) {
        super();
        this._mainEventBus = mainEventBus;
        this._nuptialEnvironmentFactory = nuptialEnvironmentFactory;
        this._nuptialEnvironmentApi = nuptialEnvironmentApi;
        this._nuptialMales = [];
        this._specie = null;

        this._mainEventBus.on('userLogout', this._onUserLogout.bind(this));
    }

    get nuptialMales() {
        return this._nuptialMales;
    }

    get specie() {
        return this._specie;
    }

    init(specieJson, nuptialMalesJson) {
        this._initSpecie(specieJson);
        this._initMales(nuptialMalesJson);
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        this._nuptialEnvironmentApi.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName);
        this._removeMale(nuptialMaleId);
    }

    playAction(action) {
        switch(action.type) {
            case ACTION_TYPES.NUPTIAL_ENVIRONMENT_MALES_CHANGED:
                this._playChangedMalesAction(action);
                break;
            default:
                throw 'unknown type of action';
        }
    }

    _initSpecie(specieJson) {
        this._specie = this._nuptialEnvironmentFactory.buildSpecie(specieJson);
        this._stopListenSpecieChange = this._specie.on('specieSchemaChanged', this._onSpecieSchemaChanged.bind(this));
    }

    _initMales(nuptialMalesJson) {
        for (let maleJson of nuptialMalesJson) {
            let male = this._nuptialEnvironmentFactory.buildNuptialMale(maleJson);
            this._nuptialMales.push(male);
        }
    }

    _removeMale(maleId) {
        let index = this._nuptialMales.findIndex(male => male.id == maleId);
        if (index !== -1) {
            this._nuptialMales.splice(index, 1);
        }
        this._emitMalesChanged();
    }

    _playChangedMalesAction(action) {
        this._initMales(action.males);
        this._emitMalesChanged();
    }

    _emitMalesChanged() {
        this._mainEventBus.emit('nuptialMalesChanged', this._nuptialMales);
    }

    _onUserLogout() {
        this._stopListenSpecieChange();
        this._specie = null;
        this._nuptialMales = [];
    }

    _onSpecieSchemaChanged() {
        this._nuptialEnvironmentApi.saveSpecieSchema(this._specie);
    }

}

export {
    NuptialEnvironmentService
}