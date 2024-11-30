import { ACTION_TYPES } from "@domain/entity/action/actionTypes";

class NuptialService {

    constructor(mainEventBus, nuptialApi, worldFactory, nuptialMalesContainer) {
        this._mainEventBus = mainEventBus;
        this._nuptialApi = nuptialApi;
        this._worldFactory = worldFactory;
        this._nuptialMalesContainer = nuptialMalesContainer;
        this._males = [];
    }

    get nuptialMales() {
        return this._males;
    }

    initEnvironment(nuptialMalesJson) {
        this._initMales(nuptialMalesJson);
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        this._nuptialApi.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName);
        this._removeMale(nuptialMaleId);
    }

    playNuptialAction(action) {
        switch(action.type) {
            case ACTION_TYPES.NUPTIAL_MALES_CHANGED:
                this._playChangedMalesAction(action);
                break;
            default:
                throw 'unknown type of action';
        }
    }

    _removeMale(maleId) {
        let index = this._males.findIndex(male => male.id == maleId);
        if (index !== -1) {
            this._males.splice(index, 1);
        }
        this._emitMalesChanged();
    }


    _initMales(nuptialMalesJson) {
        this._males = [];
        for (let maleJson of nuptialMalesJson) {
            let male = this._worldFactory.buildNuptialMale(maleJson);
            this._males.push(male);
        }
    }

    _playChangedMalesAction(action) {
        this._initMales(action.males);
        this._emitMalesChanged();
    }

    _emitMalesChanged() {
        this._mainEventBus.emit('nuptialMalesChanged', this._males);
    }

}

export {
    NuptialService
}