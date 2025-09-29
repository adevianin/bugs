import { ACTION_TYPES } from "@domain/entity/action/actionTypes";
import { BaseGameService } from "./base/baseGameService";
import { EntityTypes } from "@domain/enum/entityTypes";
import { ItemTypes } from "@domain/enum/itemTypes";
import { distance, distance_point } from "@utils/distance";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";
import { CONSTS } from "@domain/consts";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";

class ColonyService extends BaseGameService {

    static SAFETY_MARGIN = 2;

    constructor(mainEventBus, world, commandMessenger, worldFactory) {
        super(mainEventBus, world);
        this._mainEventBus = mainEventBus;
        this._commandMessenger = commandMessenger;
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
        let colony = this._worldFactory.buildAntColony(colonyJson);
        this._world.addColony(colony);
        this._mainEventBus.emit('colonyBorn', colony);
    }

    getEnemyColonyData(colonyId) {
        let colony = this._world.findColonyById(colonyId);
        let colonyNests = this._world.findNestsFromColony(colonyId);
        let xSum = 0;
        let ySum = 0;
        for (let nest of colonyNests) {
            xSum += nest.position.x;
            ySum += nest.position.y;
        }
        let averageX = Math.round(xSum / colonyNests.length);
        let averageY = Math.round(ySum / colonyNests.length);

        return {
            id: colonyId,
            name: colony.name,
            position: { x: averageX, y: averageY }
        }
    }

    stopOperation(colonyId, operationId) {
        this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('stop_operation', {
            colony_id: colonyId,
            operation_id: operationId
        }));
    }

    async buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName) {
        try {
            let operationId = await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('build_new_sub_nest_operation', {
                performing_colony_id: performingColonyId,
                building_site: [buildingSite.x, buildingSite.y],
                workers_count: workersCount,
                warriors_count: warriorsCount,
                nest_name: nestName
            }));
            return this._makeSuccessResult({ operationId: operationId });
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }   

    async destroyNestOperation(performingColonyId, warriorsCount, workersCount, nestId) {
        try {
            let operationId = await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('destroy_nest_operation', {
                performing_colony_id: performingColonyId,
                workers_count: workersCount,
                warriors_count: warriorsCount,
                nest_id: nestId
            }));

            return this._makeSuccessResult({ operationId: operationId });
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        try {
            let operationId = await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('pillage_nest_operation', {
                performing_colony_id: performingColonyId,
                workers_count: workersCount,
                warriors_count: warriorsCount,
                nest_to_pillage_id: pillagingNestId,
                nest_for_loot_id: nestForLootId
            }));
            return this._makeSuccessResult({ operationId: operationId });
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        try {
            let operationId = await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('transport_food_operation', {
                performing_colony_id: performingColonyId,
                workers_count: workersCount,
                warriors_count: warriorsCount,
                from_nest_id: fromNestId,
                to_nest_id: toNestId
            }));
            return this._makeSuccessResult({ operationId: operationId });
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async buildFortificationsOpearation(performingColonyId, nestId, workersCount) {
        try {
            let operationId = await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('build_fortification_operation', {
                performing_colony_id: performingColonyId,
                workers_count: workersCount,
                nest_id: nestId
            }));
            return this._makeSuccessResult({ operationId: operationId });
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    async bringBugOpearation(performingColonyId, nestId) {
        try{
            let operationId = await this._commandMessengerRequestHandler(() => this._commandMessenger.sendPlayerCommand('bring_bug_operation', {
                performing_colony_id: performingColonyId,
                nest_id: nestId
            }));
            return this._makeSuccessResult({ operationId: operationId });
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                return this._makeErrorResultConflict();
            } else if (e instanceof GenericRequestError) {
                return this._makeErrorResultUnknownErr();
            }
        }
    }

    buildMarker(type, point, params = {}) {
        return {
            type,
            point,
            params
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
        let nests = entities.filter(e => e.type == EntityTypes.NEST);
        if (mainNestPosition) {
            let maxBlockingDist = CONSTS.MAX_DISTANCE_TO_SUB_NEST + CONSTS.ITEM_SOURCE_BLOCKING_RADIUS;
            itemSources = itemSources.filter(is => distance_point(is.position, mainNestPosition) <= maxBlockingDist);
            nests = nests.filter(nest => distance_point(nest.position, mainNestPosition) <= maxBlockingDist);
        }
        
        let exclusions = [];
        for (let itemSource of itemSources) {
            exclusions.push({ center: itemSource.position, radius: CONSTS.ITEM_SOURCE_BLOCKING_RADIUS + ColonyService.SAFETY_MARGIN });
        }

        for (let nest of nests) {
            exclusions.push({ center: nest.position, radius: CONSTS.NEST_BLOCKING_RADIUS + ColonyService.SAFETY_MARGIN });
        }

        return {
            area,
            exclusions
        };
    }

    getRaidableArea(raidingColonyId, raidAreaCenter, chunkIds) {
        let entities = this._world.getEntitiesFromChunks(chunkIds);
        let nests = entities.filter(e => e.type == EntityTypes.NEST);
        let area = { center: raidAreaCenter, radius: CONSTS.MAX_DISTANCE_TO_OPERATION_TARGET - CONSTS.NEST_BLOCKING_RADIUS - ColonyService.SAFETY_MARGIN};

        let nestPickers = [];
        let exclusions = [];

        for (let nest of nests) {
            if (nest.fromColony == raidingColonyId) {
                exclusions.push({ center: nest.position, radius: CONSTS.NEST_BLOCKING_RADIUS });
            } else {
                nestPickers.push({ center: nest.position, radius: CONSTS.NEST_BLOCKING_RADIUS, nestId: nest.id });
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

    validateBuildingSubNestPosition(position) {
        if (!position) {
            return GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_NEEDED;
        }

        if (!this._checkIsBuildPositionFreeFromNests(position)) {
            return GAME_MESSAGE_IDS.NEW_SUB_NEST_OPER_BUILDING_POSITION_BLOCKED;
        }

        return null;
    }

    validateBuildingNewNestPosition(position) {
        if (!position) {
            return GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_NEEDED;
        }

        if (!this._checkIsBuildPositionFreeFromNests(position)) {
            return GAME_MESSAGE_IDS.BREEDING_PLACE_TO_SETTLE_BLOCKED;
        }

        return null;
    }

    validateBreedingQueen(queenId) {
        let queen = this._world.findEntityById(queenId);

        if (!queen) {
            return GAME_MESSAGE_IDS.BREEDING_QUEEN_NEEDED;
        }

        if (queen.isDied) {
            return GAME_MESSAGE_IDS.BREEDING_LIVE_QUEEN_NEEDED;
        }

        return null;
    }

    validateDestroyNestOperationConditions(colonyId) {
        let queen = this._world.getQueenOfColony(colonyId);
        if (!queen) {
            return GAME_MESSAGE_IDS.DESTROY_NEST_OPER_CANT_ATTACK_WITHOUT_QUEEN;
        }

        return null;
    }

    validateNestToDestroy(nestId) {
        let nest = this._world.findEntityById(nestId);

        if (!nestId) {
            return GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NEST_NEEDED;
        }

        if (!nest || nest.isDied) {
            return GAME_MESSAGE_IDS.DESTROY_NEST_OPER_NOT_DESTROYED_NEST_NEEDED;
        }
        
        return null;
    }

    validatePillageNestOperationConditions(colonyId) {
        let queen = this._world.getQueenOfColony(colonyId);
        if (!queen) {
            return GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_CANT_PILLAGE_WITHOUT_QUEEN;
        }

        return null;
    }

    validateNestToPillage(nestId) {
        let nest = this._world.findEntityById(nestId);

        if (!nestId) {
            return GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NEST_TO_PILLAGE_NEEDED;
        }

        if (!nest || nest.isDied) {
            return GAME_MESSAGE_IDS.PILLAGE_NEST_OPER_NOT_DESTROYED_NEST_TO_PILLAGE_NEEDED;
        }

        return null;
    }

    _checkIsBuildPositionFreeFromNests(position) {
        let nearEntities = this._world.getEntitiesNear(position, CONSTS.NEST_BLOCKING_RADIUS + ColonyService.SAFETY_MARGIN);
        let nearNests = nearEntities.filter(e => e.type == EntityTypes.NEST);
        return nearNests.length == 0;
    }

    _onColonyDied(colony) {
        this._world.deleteColony(colony);
    }

}

export {
    ColonyService
}