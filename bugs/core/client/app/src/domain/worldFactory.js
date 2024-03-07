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
import { WarriorAnt, WorkerAnt, QueenAnt, MaleAnt } from './entity/ant';
import { Egg } from './entity/egg';
import { Genome } from './entity/genome';
import { NuptialMale } from './entity/nuptialMale';

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
                        return this.buildQueenAnt(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.owner_id, entityJson.user_speed, 
                            entityJson.hp, entityJson.max_hp, entityJson.picked_item_id, entityJson.located_in_nest_id, entityJson.home_nest_id, entityJson.stats, 
                            entityJson.is_fertilized, entityJson.is_in_nuptial_flight, entityJson.genes)
                    case AntTypes.WARRIOR:
                        return this.buildWarriorAnt(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.owner_id, entityJson.user_speed, 
                            entityJson.hp, entityJson.max_hp, entityJson.picked_item_id, entityJson.located_in_nest_id, entityJson.home_nest_id, entityJson.stats)
                    case AntTypes.WORKER:
                        return this.buildWorkerAnt(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.owner_id, entityJson.user_speed, 
                            entityJson.hp, entityJson.max_hp, entityJson.picked_item_id, entityJson.located_in_nest_id, entityJson.home_nest_id, entityJson.stats)
                    case AntTypes.MALE:
                        return this.buildMaleAnt(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.owner_id, entityJson.user_speed, 
                            entityJson.hp, entityJson.max_hp, entityJson.picked_item_id, entityJson.located_in_nest_id, entityJson.home_nest_id, entityJson.stats);
                    default:
                        throw 'unknown type of ant';
                }
            case EntityTypes.GROUND_BEETLE:
                return this.buildGroundBeetle(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.user_speed, entityJson.hp, 
                    entityJson.max_hp);
            case EntityTypes.NEST:
                return this.buildNest(entityJson);
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

    buildQueenAnt(id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, isFertilized, isInNuptialFlight, genes) {
        return new QueenAnt(this._mainEventBus, this._antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, isFertilized, 
            isInNuptialFlight, genes);
    }

    buildWorkerAnt(id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats) {
        return new WorkerAnt(this._mainEventBus, this._antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats);
    }

    buildWarriorAnt(id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats) {
        return new WarriorAnt(this._mainEventBus, this._antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats);
    }

    buildMaleAnt(id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats) {
        return new MaleAnt(this._mainEventBus, this._antApi, id, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats);
    }

    buildNest(nestJson) {
        let eggs = [];
        for (let eggJson of nestJson.eggs) {
            let egg = Egg.buildFromJson(eggJson);
            eggs.push(egg);
        }

        let larvae = [];
        for (let larvaJson of nestJson.larvae) {
            let larva = Larva.buildFromJson(larvaJson);
            larvae.push(larva);
        }

        let id = nestJson.id;
        let position = nestJson.position;
        let angle = nestJson.angle;
        let fromColonyId = nestJson.from_colony_id;
        let ownerId = nestJson.owner_id;
        let storedCalories = nestJson.storedCalories;
        let larvaPlacesCount = nestJson.larvaPlacesCount;
        let eggPlacesCount = nestJson.eggPlacesCount;
        let isBuilt = nestJson.isBuilt;
        let hp = nestJson.hp;
        let maxHp = nestJson.max_hp;
        return new Nest(this._mainEventBus, this._nestApi, id, position, angle, fromColonyId, ownerId, storedCalories, larvae, eggs, larvaPlacesCount, eggPlacesCount, isBuilt, hp, maxHp);
    }

    buildAntColony(id, owner_id, operations, queenId) {
        return new AntColony(id, owner_id, operations, queenId);
    }

    buildGroundBeetle(id, position, angle, fromColony, userSpeed, hp, maxHp) {
        return new GroundBeetle(this._mainEventBus, id, position, angle, fromColony, userSpeed, hp, maxHp);
    }

    buildNuptialMale(nuptialMaleJson) {
        let genome = this._buildGenome(nuptialMaleJson.genome);
        return new NuptialMale(nuptialMaleJson.id, genome, nuptialMaleJson.stats, nuptialMaleJson.isLocal);
    }

    _buildGenome(genomeJson) {
        return new Genome(genomeJson.maternal, genomeJson.paternal, genomeJson.avaliableAntTypes);
    }

}

export { 
    WorldFactory
}