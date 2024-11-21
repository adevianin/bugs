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
import { Genome } from './entity/genetic/genome';
import { NuptialMale } from './entity/nuptialMale';
import { Climate } from './entity/climate';
import { Tree } from './entity/tree';
import { Ladybug } from './entity/ladybug';

class WorldFactory {

    constructor(mainEventBus, nestApi, antApi) {
        this._mainEventBus = mainEventBus;
        this._nestApi = nestApi;
        this._antApi = antApi;
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.ANT: 
                return this.buildAnt(entityJson)
            case EntityTypes.GROUND_BEETLE:
                return this.buildGroundBeetle(entityJson.id, entityJson.position, entityJson.angle, entityJson.from_colony_id, entityJson.user_speed, entityJson.hp, 
                    entityJson.max_hp);
            case EntityTypes.LADYBUG:
                return this.buildLadybug(entityJson);
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
            case EntityTypes.TREE:
                return this.buildTree(entityJson);
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
        let climate = new Climate();
        return new World(this._mainEventBus, climate);
    }

    buildLadybug(json) {
        return new Ladybug(this._mainEventBus, json.id, json.position, json.angle, json.from_colony_id, json.user_speed, json.hp, json.max_hp);
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
        let isBuilt = nestJson.isBuilt;
        let hp = nestJson.hp;
        let maxHp = nestJson.max_hp;
        let maxFortification = nestJson.maxFortification;
        let fortification = nestJson.fortification;
        return new Nest(this._mainEventBus, this._nestApi, id, position, angle, fromColonyId, ownerId, storedCalories, larvae, eggs, isBuilt, 
            hp, maxHp, fortification, maxFortification);
    }

    buildAnt(antJson) {
        let id = antJson.id;
        let name = antJson.name;
        let position = antJson.position;
        let angle = antJson.angle;
        let fromColony = antJson.from_colony_id;
        let ownerId = antJson.owner_id;
        let userSpeed = antJson.user_speed;
        let hp = antJson.hp;
        let maxHp = antJson.max_hp;
        let pickedItemId = antJson.picked_item_id;
        let locatedInNestId = antJson.located_in_nest_id;
        let homeNestId = antJson.home_nest_id;
        let stats = antJson.stats;
        let behavior = antJson.behavior;
        let genome = antJson.genome;
        let birthStep = antJson.birthStep;

        switch (antJson.ant_type) {
            case AntTypes.QUEEN:
                let isFertilized = antJson.is_fertilized;
                let isInNuptialFlight = antJson.is_in_nuptial_flight;
                let genes = antJson.genes;
                return new QueenAnt(this._mainEventBus, this._antApi, id, name, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, behavior,
                    genome, birthStep, isFertilized, isInNuptialFlight, genes);
            case AntTypes.WARRIOR:
                return new WarriorAnt(this._mainEventBus, this._antApi, id, name, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep);
            case AntTypes.WORKER:
                return new WorkerAnt(this._mainEventBus, this._antApi, id, name, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep);
            case AntTypes.MALE:
                return new MaleAnt(this._mainEventBus, this._antApi, id, name, position, angle, fromColony, ownerId, userSpeed, hp, maxHp, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep);
            default:
                throw 'unknown type of ant';
        }
    }

    buildTree(treeJson) {
        let id = treeJson.id;
        let position = treeJson.position;
        let angle = treeJson.angle;
        let fromColony = treeJson.fromColony;
        let ownerId = treeJson.ownerId;
        let hp = treeJson.hp;
        let maxHp = treeJson.maxHp;
        return new Tree(this._mainEventBus, id, position, angle, fromColony, ownerId, hp, maxHp);
    }

    buildAntColony(id, owner_id, operations, queenId) {
        return new AntColony(this._mainEventBus, id, owner_id, operations, queenId);
    }

    buildGroundBeetle(id, position, angle, fromColony, userSpeed, hp, maxHp) {
        return new GroundBeetle(this._mainEventBus, id, position, angle, fromColony, userSpeed, hp, maxHp);
    }

    buildNuptialMale(nuptialMaleJson) {
        let genome = Genome.buildFromJson(nuptialMaleJson.genome);
        return new NuptialMale(nuptialMaleJson.id, genome, nuptialMaleJson.stats, nuptialMaleJson.isLocal);
    }

}

export { 
    WorldFactory
}