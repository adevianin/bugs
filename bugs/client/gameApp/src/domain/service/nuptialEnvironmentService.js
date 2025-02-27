import { EventEmitter } from "@utils/eventEmitter";
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";

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
        this._setMales(nuptialMalesJson);
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        this._removeMale(nuptialMaleId);
        return this._nuptialEnvironmentApi.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName);
    }

    playAction(action) {
        switch(action.type) {
            case ACTION_TYPES.NUPTIAL_ENVIRONMENT_MALES_CHANGED:
                this._playChangedMalesAction(action);
                break;
            case ACTION_TYPES.NUPTIAL_ENVIRONMENT_SPECIE_GENES_CHANGED:
                this._playSpecieGenesChanged(action);
                break;
            default:
                throw 'unknown type of action';
        }
    }

    _initSpecie(specieJson) {
        this._specie = this._nuptialEnvironmentFactory.buildSpecie(specieJson);
        this._stopListenSpecieChange = this._specie.on('specieSchemaChanged', this._onSpecieSchemaChanged.bind(this));
    }

    _setMales(nuptialMalesJson) {
        this._nuptialMales = [];
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
        this._setMales(action.males);
        this._emitMalesChanged();
    }

    _playSpecieGenesChanged(action) {
        let chromosomeSpecieGenesJson = action.chromosomeSpecieGenes;
        for (let chromosomeType in chromosomeSpecieGenesJson) {
            let specieChromosome = this._specie.getChromosomeByType(chromosomeType);
            specieChromosome.updateGenes(chromosomeSpecieGenesJson[chromosomeType]);
        }

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