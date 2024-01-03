import { EntityTypes } from './enum/entityTypes';
import { World } from './entity/world';
import { Nest } from './entity/nest';
import { Larva } from './entity/larva';
import { AntColony } from './entity/antColony';
import { GroundBeetle } from './entity/groundBeetle';
import { Item } from './entity/item';
import { ItemSource } from './entity/itemSource';
import { ItemArea } from './entity/itemArea';
import { AntTypes } from './enum/antTypes';
import { WarriorAnt, WorkerAnt, QueenAnt } from './entity/ant';

class WorldFactory {

    constructor(mainEventBus, nestApi, antApi) {
        this._mainEventBus = mainEventBus;
        this._nestApi = nestApi;
        this._antApi = antApi;
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.ANT: 
                switch (entityJson.ant_type) {
                    case AntTypes.QUEEN:
                        return this.buildQueenAnt(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.user_speed, 
                            entityJson.hp, entityJson.max_hp, entityJson.picked_item_id, entityJson.located_in_nest_id, entityJson.home_nest_id, entityJson.stats, 
                            entityJson.is_fertilized, entityJson.is_in_nuptial_flight, entityJson.genes)
                    case AntTypes.WARRIOR:
                        return this.buildWarriorAnt(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.user_speed, entityJson.hp, 
                            entityJson.max_hp, entityJson.picked_item_id, entityJson.located_in_nest_id, entityJson.home_nest_id, entityJson.stats)
                    case AntTypes.WORKER:
                        return this.buildWorkerAnt(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.user_speed, entityJson.hp, 
                            entityJson.max_hp, entityJson.picked_item_id, entityJson.located_in_nest_id, entityJson.home_nest_id, entityJson.stats)
                }
            case EntityTypes.GROUND_BEETLE:
                return this.buildGroundBeetle(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.user_speed, entityJson.hp, 
                    entityJson.max_hp);
            case EntityTypes.NEST:
                return this.buildNest(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.stored_calories, entityJson.larvae, 
                    entityJson.larva_places_count, entityJson.is_built, entityJson.hp, entityJson.max_hp);
            case EntityTypes.ITEM:
                return this.buildItem(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.hp, entityJson.max_hp, 
                    entityJson.item_type, entityJson.variety, entityJson.is_picked);
            case EntityTypes.ITEM_SOURCE:
                return this.buildItemSource(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.hp, entityJson.max_hp, 
                    entityJson.item_type, entityJson.is_fertile);
            case EntityTypes.ITEM_AREA:
                return this.buildItemArea(entityJson.id, entityJson.position, entityJson.angle, entityJson.hp, entityJson.max_hp);
            default:
                throw 'unknown type of entity';
        }
    }

    buildItemArea(id, position, angle, hp, maxHp) {
        return new ItemArea(this._mainEventBus, id, position, angle, hp, maxHp);
    }

    buildItemSource(id, position, angle, fromColony, hp, maxHp, itemType, isFertile) {
        return new ItemSource(this._mainEventBus, id, position, angle, fromColony, hp, maxHp, itemType, isFertile);
    }

    buildItem(id, position, angle, fromColony, hp, maxHp, itemType, itemVariety, isPicked) {
        return new Item(this._mainEventBus, id, position, angle, fromColony, hp, maxHp, itemType, itemVariety, isPicked);
    }

    buildWorld() {
        return new World(this._mainEventBus);
    }

    buildQueenAnt(id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, isFertilized, isInNuptialFlight, genes) {
        return new QueenAnt(this._mainEventBus, this._antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, isFertilized, 
            isInNuptialFlight, genes);
    }

    buildWorkerAnt(id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats) {
        return new WorkerAnt(this._mainEventBus, this._antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats);
    }

    buildWarriorAnt(id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats) {
        return new WarriorAnt(this._mainEventBus, this._antApi, id, position, angle, fromColony, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats);
    }

    buildNest(id, position, angle, fromColony, storedCalories, larvaeData, larvaPlacesCount, isBuilt, hp, maxHp) {
        let larvae = [];
        larvaeData.forEach(larvaData => larvae.push(Larva.fromJson(larvaData.ant_type, larvaData.progress)));
        return new Nest(this._mainEventBus, this._nestApi, id, position, angle, fromColony, storedCalories, larvae, larvaPlacesCount, isBuilt, hp, maxHp);
    }

    buildAntColony(id, owner_id, operations, queenId) {
        return new AntColony(id, owner_id, operations, queenId);
    }

    buildGroundBeetle(id, position, angle, fromColony, userSpeed, hp, maxHp) {
        return new GroundBeetle(this._mainEventBus, id, position, angle, fromColony, userSpeed, hp, maxHp);
    }
}

export { 
    WorldFactory
}