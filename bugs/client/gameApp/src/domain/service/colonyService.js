import { ACTION_TYPES } from "@domain/entity/action/actionTypes";
import { BaseGameService } from "./base/baseGameService";
import { EntityTypes } from "@domain/enum/entityTypes";
import { ItemTypes } from "@domain/enum/itemTypes";
import { distance, distance_point } from "@utils/distance";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { CONSTS } from "@domain/consts";

class ColonyService extends BaseGameService {

    static SAFETY_MARGIN = 2;

    constructor(mainEventBus, world, colonyApi, worldFactory) {
        super(mainEventBus, world);
        this._mainEventBus = mainEventBus;
        this._colonyApi = colonyApi;
        this._world = world;
        this._worldFactory = worldFactory;

        this._mainEventBus.on('colonyDied', this._onColonyDied.bind(this));
    }

    playColonyAction(action) {
        switch(action.type) {
            case ACTION_TYPES.COLONY_BORN:
                this.giveBirthToColony(action.actionData.colony);
                break;
            default:
                let colony = this._world.findColonyById(action.actorId);
                colony.playAction(action);
        }
    
    }
    giveBirthToColony(colonyJson) {
        let colony = this._worldFactory.buildAntColony(colonyJson.id, colonyJson.owner_id, colonyJson.name, colonyJson.operations);
        this._world.addColony(colony);
        this._mainEventBus.emit('colonyBorn', colony);
    }

    stopOperation(colonyId, operationId) {
        this._colonyApi.stopOperation(colonyId, operationId);
    }

    buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName) {
        return this._requestHandler(() => this._colonyApi.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName));
    }

    destroyNestOperation(performingColonyId, warriorsCount, workersCount, nest) {
        return this._requestHandler(() => this._colonyApi.destroyNestOperation(performingColonyId, warriorsCount, workersCount, nest));
    }

    pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        return this._requestHandler(() => this._colonyApi.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount));
    }

    transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        return this._requestHandler(() => this._colonyApi.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount));
    }

    buildFortificationsOpearation(performingColonyId, nestId, workersCount) {
        return this._requestHandler(() => this._colonyApi.buildFortificationsOpearation(performingColonyId, nestId, workersCount));
    }

    bringBugOpearation(performingColonyId, nestId) {
        return this._requestHandler(() => this._colonyApi.bringBugOpearation(performingColonyId, nestId));
    }

    buildMarker(type, point) {
        return {
            type,
            point
        };
    }

    findClosestBugCorpseNearNest(nestId) {
        let nest = this._world.findEntityById(nestId);
        let items = this._world.findEntityByType(EntityTypes.ITEM);
        let bugCorpsesInNestArea = items
            .filter(
                (i) =>
                    i.itemType === ItemTypes.BUG_CORPSE &&
                    distance(nest.position.x, nest.position.y, i.position.x, i.position.y) <= nest.area &&
                    !i.isBringing
            )
            .sort(
                (a, b) =>
                    distance(nest.position.x, nest.position.y, a.position.x, a.position.y) - 
                    distance(nest.position.x, nest.position.y, b.position.x, b.position.y)
            );
        
            return bugCorpsesInNestArea.length > 0 ? bugCorpsesInNestArea[0] : null;
    }

    getNestBuildableArea(mainNestPosition, chunkIds) {
        let area = null;
        if (mainNestPosition) {
            area = { center: mainNestPosition, radius: CONSTS.MAX_DISTANCE_TO_SUB_NEST - ColonyService.SAFETY_MARGIN};
        }
        
        let entities = this._world.getEntitiesFromChunks(chunkIds);
        let itemSources = entities.filter(e => e.type == EntityTypes.ITEM_SOURCE);
        if (mainNestPosition) {
            let maxBlockingDist = CONSTS.MAX_DISTANCE_TO_SUB_NEST + CONSTS.ITEM_SOURCE_BLOCKING_RADIUS;
            itemSources = itemSources.filter(is => distance_point(is.position, mainNestPosition) <= maxBlockingDist);
        }
        
        let exclusions = [];
        for (let itemSource of itemSources) {
            exclusions.push({ center: itemSource.position, radius: CONSTS.ITEM_SOURCE_BLOCKING_RADIUS + ColonyService.SAFETY_MARGIN });
        }

        return {
            area,
            exclusions
        };
    }

    getRaidableArea(raidingColonyId, raidAreaCenter, chunkIds) {
        let entities = this._world.getEntitiesFromChunks(chunkIds);
        let nests = entities.filter(e => e.type == EntityTypes.NEST);
        let area = { center: raidAreaCenter, radius: CONSTS.MAX_DISTANCE_TO_OPERATION_TARGET - ColonyService.SAFETY_MARGIN};

        let nestPickers = [];
        let exclusions = [];

        for (let nest of nests) {
            if (nest.fromColony == raidingColonyId) {
                exclusions.push({ center: nest.position, radius: CONSTS.NEST_BLOCKING_RADIUS });
            } else {
                nestPickers.push({ center: nest.position, radius: CONSTS.NEST_BLOCKING_RADIUS, nest: nest });
            }
        }

        return {
            area,
            nestPickers,
            exclusions
        }
    }

    validateNewNestOperationConditions(colonyId) {
        let queen = this._world.getQueenOfColony(colonyId);
        let mainNest = this._world.getMainNestOfColony(colonyId);
        if (!queen || !mainNest) {
            return GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_SUB_NEST_WITHOUT_QUEEN;
        }

        let subNests = this._world.getSubNestsOfColony(colonyId);
        if (subNests.length >= CONSTS.MAX_SUB_NEST_COUNT) {
            return GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_CANT_BUILD_MORE_SUB_NESTS;
        }

        return null;
    }

    validateDestroyNestOperationConditions(colonyId) {
        let queen = this._world.getQueenOfColony(colonyId);
        if (!queen) {
            return 'CANT_DESTROY_NEST_WITHOUT_LIVING_QUEEN';
        }

        return null;
    }

    validatePillageNestOperationConditions(colonyId) {
        let queen = this._world.getQueenOfColony(colonyId);
        if (!queen) {
            return 'CANT_PILLAGE_NEST_WITHOUT_LIVING_QUEEN';
        }

        return null;
    }

    _onColonyDied(colony) {
        this._world.deleteColony(colony);
    }

}

export {
    ColonyService
}