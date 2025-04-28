import { BaseGameService } from "./base/baseGameService";
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";

class NuptialEnvironmentService extends BaseGameService {

    constructor(mainEventBus, world, nuptialEnv, nuptialEnvironmentApi) {
        super(mainEventBus, world);
        this._nuptialEnv = nuptialEnv;
        this._nuptialEnvironmentApi = nuptialEnvironmentApi;
    }

    init(specieData, nuptialMales) {
        this._nuptialEnv.setSpecieData(specieData);
        this._nuptialEnv.setNuptialMales(nuptialMales);
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

    bornNewAntara() {
        this._nuptialEnvironmentApi.bornNewAntara();
    }

    saveSpecieSchema(schema) {
        this._nuptialEnvironmentApi.saveSpecieSchema(schema);
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

    _playChangedMalesAction(action) {
        this._nuptialEnv.setNuptialMales(action.males);
        this._mainEventBus.emit('nuptialMalesChanged');
    }

    _playSpecieGenesChanged(action) {
        this._mainEventBus.emit('specieChromosomesGenesChanged', action.chromosomeSpecieGenes);
    }

}

export {
    NuptialEnvironmentService
}