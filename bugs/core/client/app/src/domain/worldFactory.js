import { EntityTypes } from './enum/entityTypes';
import { Ant } from './entity/ant';
import { World } from './entity/world';
import { Nest } from './entity/nest';
import { Larva } from './entity/larva';
import { Colony } from './entity/colony';
import { GroundBeetle } from './entity/groundBeetle';
import { Item } from './entity/item';
import { ItemSource } from './entity/itemSource';
import { ItemArea } from './entity/itemArea';

class WorldFactory {

    constructor(mainEventBus, nestApi) {
        this._mainEventBus = mainEventBus;
        this._nestApi = nestApi;
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.ANT: 
                return this.buildAnt(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.user_speed, entityJson.hp, entityJson.max_hp, entityJson.ant_type, entityJson.picked_item_id, entityJson.located_in_nest_id);
            case EntityTypes.GROUND_BEETLE:
                return this.buildGroundBeetle(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.user_speed, entityJson.hp, entityJson.max_hp);
            case EntityTypes.NEST:
                return this.buildNest(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.stored_calories, entityJson.larvae, entityJson.larva_places_count, entityJson.is_built, entityJson.hp, entityJson.max_hp);
            case EntityTypes.ITEM:
                return this.buildItem(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.hp, entityJson.max_hp, entityJson.item_type, entityJson.variety, entityJson.is_picked);
            case EntityTypes.ITEM_SOURCE:
                return this.buildItemSource(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.hp, entityJson.max_hp, entityJson.item_type, entityJson.is_fertile);
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

    buildAnt(id, position, angle, fromColony, userSpeed, hp, maxHp, antType, pickedItemId, locatedInNestId) {
        return new Ant(this._mainEventBus, id, position, angle, fromColony, userSpeed, hp, maxHp, antType, pickedItemId, locatedInNestId);
    }

    buildNest(id, position, angle, fromColony, storedCalories, larvaeData, larvaPlacesCount, isBuilt, hp, maxHp) {
        let larvae = [];
        larvaeData.forEach(larvaData => larvae.push(Larva.fromJson(larvaData.ant_type, larvaData.progress)));
        return new Nest(this._mainEventBus, this._nestApi, id, position, angle, fromColony, storedCalories, larvae, larvaPlacesCount, isBuilt, hp, maxHp);
    }

    buildColony(id, owner_id, operations) {
        return new Colony(id, owner_id, operations);
    }

    buildGroundBeetle(id, position, angle, fromColony, userSpeed, hp, maxHp) {
        return new GroundBeetle(this._mainEventBus, id, position, angle, fromColony, userSpeed, hp, maxHp);
    }
}

export { 
    WorldFactory
}