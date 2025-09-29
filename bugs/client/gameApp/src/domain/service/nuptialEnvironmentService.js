import { BaseGameService } from "./base/baseGameService";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";
import { ACTION_TYPES } from "@domain/entity/action/actionTypes";

class NuptialEnvironmentService extends BaseGameService {

    constructor(mainEventBus, world, nuptialEnv, commandMessenger) {
        super(mainEventBus, world);
        this._nuptialEnv = nuptialEnv;
        this._commandMessenger = commandMessenger;
    }

    init(specieData, nuptialMales) {
        this._nuptialEnv.setSpecieData(specieData);
        this._nuptialEnv.setNuptialMales(nuptialMales);
    }

    async foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        try {
            await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('found_colony', {
                queen_id: queenId,
                nuptial_male_id: nuptialMaleId,
                nest_building_site: [nestBuildingSite.x, nestBuildingSite.y],
                colony_name: colonyName
            }));
            return this._makeSuccessResult();
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            } else {
                throw e;
            }
        }
    }

    bornNewAntara() {
        this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('born_new_antara'));
    }

    saveSpecieSchema(schema) {
        this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('change_specie_schema', {
            specie_schema: schema
        }));
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