import { BaseGameService } from "./base/baseGameService";
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";

class NuptialEnvironmentService extends BaseGameService {

    constructor(mainEventBus, world, nuptialEnv, nuptialEnvironmentFactory, nuptialEnvironmentApi) {
        super(mainEventBus, world);
        this._nuptialEnv = nuptialEnv;
        this._nuptialEnvironmentFactory = nuptialEnvironmentFactory;
        this._nuptialEnvironmentApi = nuptialEnvironmentApi;
    }

    init(specieJson, nuptialMalesJson) {
        this._initSpecie(specieJson);
        this._updateMales(nuptialMalesJson);
    }

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        try {
            this._requestHandler(() => this._nuptialEnvironmentApi.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName));
            return this._makeSuccessResult();
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
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

    bornNewAntara() {
        this._nuptialEnvironmentApi.bornNewAntara();
    }

    _initSpecie(specieJson) {
        let specie = this._nuptialEnvironmentFactory.buildSpecie(specieJson);
        this._nuptialEnv.setSpecie(specie);
        specie.on('specieSchemaChanged', this._onSpecieSchemaChanged.bind(this));
    }

    _updateMales(nuptialMalesJson) {
        let nuptialMales = [];
        for (let maleJson of nuptialMalesJson) {
            let male = this._nuptialEnvironmentFactory.buildNuptialMale(maleJson);
            nuptialMales.push(male);
        }
        this._nuptialEnv.setNuptialMales(nuptialMales);
    }

    _playChangedMalesAction(action) {
        this._updateMales(action.males);
    }

    _playSpecieGenesChanged(action) {
        this._nuptialEnv.updateSpecieGenes(action.chromosomeSpecieGenes);
    }

    _onSpecieSchemaChanged() {
        this._nuptialEnvironmentApi.saveSpecieSchema(this._nuptialEnv.specie);
    }

}

export {
    NuptialEnvironmentService
}