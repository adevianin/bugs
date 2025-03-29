import { EntityTypes } from './enum/entityTypes';
import { World } from './entity/world';
import { Nest } from './entity/nest';
import { Larva } from './entity/larva';
import { AntColony } from './entity/antColony';
import { Item } from './entity/item';
import { ItemSource } from './entity/itemSource';
import { ItemArea } from './entity/itemArea';
import { AntTypes } from './enum/antTypes';
import { WarriorAnt, WorkerAnt, QueenAnt, MaleAnt } from './entity/ant';
import { Egg } from './entity/egg';
import { Climate } from './entity/climate';
import { Tree } from './entity/tree';
import { Ladybug } from './entity/ladybug';
import { Genome } from './entity/genetic/genome';

class WorldFactory {

    constructor(mainEventBus) {
        this._mainEventBus = mainEventBus;
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.ANT: 
                return this.buildAnt(entityJson)
            case EntityTypes.LADYBUG:
                return this.buildLadybug(entityJson);
            case EntityTypes.NEST:
                return this.buildNest(entityJson);
            case EntityTypes.ITEM:
                return this.buildItem(entityJson);
            case EntityTypes.ITEM_SOURCE:
                return this.buildItemSource(entityJson);
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

    buildItemSource(entityJson) {
        let id = entityJson.id;
        let position = entityJson.position;
        let angle = entityJson.angle;
        let fromColonyId = entityJson.from_colony_id;
        let hp = entityJson.hp;
        let maxHp = entityJson.max_hp;
        let itemType = entityJson.itemType;
        let isDamaged = entityJson.isDamaged;
        let accumulated = entityJson.accumulated;
        let maxAccumulated = entityJson.maxAccumulated;
        let fertility = entityJson.fertility;
        return new ItemSource(this._mainEventBus, id, position, angle, fromColonyId, hp, maxHp, itemType, isDamaged, accumulated, maxAccumulated, fertility);
    }

    buildItem(entityJson) {
        let id = entityJson.id; 
        let position = entityJson.position;
        let angle = entityJson.angle;
        let fromColony = entityJson.from_colony_id;
        let hp = entityJson.hp;
        let maxHp = entityJson.max_hp
        let itemType = entityJson.itemType;
        let itemVariety = entityJson.variety;
        let isPicked = entityJson.isPicked;
        let isBringing = entityJson.isBringing;
        return new Item(this._mainEventBus, id, position, angle, fromColony, hp, maxHp, itemType, itemVariety, isPicked, isBringing);
    }

    buildWorld() {
        let climate = new Climate();
        return new World(this._mainEventBus, climate);
    }

    buildLadybug(json) {
        return new Ladybug(this._mainEventBus, json.id, json.position, json.angle, json.from_colony_id, json.hp, json.max_hp, json.isInHibernation);
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
        let name = nestJson.name;
        let isMain = nestJson.isMain;
        let area = nestJson.area;
        return new Nest(this._mainEventBus, id, position, angle, fromColonyId, ownerId, storedCalories, larvae, eggs, isBuilt, 
            hp, maxHp, fortification, maxFortification, name, isMain, area);
    }

    buildAnt(antJson) {
        let id = antJson.id;
        let name = antJson.name;
        let position = antJson.position;
        let angle = antJson.angle;
        let fromColony = antJson.from_colony_id;
        let ownerId = antJson.owner_id;
        let hp = antJson.hp;
        let maxHp = antJson.max_hp;
        let isInHibernation = antJson.isInHibernation;
        let pickedItemId = antJson.picked_item_id;
        let locatedInNestId = antJson.located_in_nest_id;
        let homeNestId = antJson.home_nest_id;
        let stats = antJson.stats;
        let behavior = antJson.behavior;
        let genome = Genome.buildFromJson(antJson.genome);
        let birthStep = antJson.birthStep;
        let currentActivity = antJson.currentActivity;

        switch (antJson.ant_type) {
            case AntTypes.QUEEN:
                let isFertilized = antJson.isFertilized;
                let isInNuptialFlight = antJson.isInNuptialFlight;
                let breedingMaleGenome = antJson.breedingMaleGenome ? Genome.buildFromJson(antJson.breedingMaleGenome) : null;
                return new QueenAnt(this._mainEventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior,
                    genome, birthStep, currentActivity, isFertilized, isInNuptialFlight, breedingMaleGenome);
            case AntTypes.WARRIOR:
                return new WarriorAnt(this._mainEventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity);
            case AntTypes.WORKER:
                return new WorkerAnt(this._mainEventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity);
            case AntTypes.MALE:
                return new MaleAnt(this._mainEventBus, id, name, position, angle, fromColony, ownerId, hp, maxHp, isInHibernation, pickedItemId, locatedInNestId, homeNestId, stats, behavior, genome, birthStep, currentActivity);
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

    buildAntColony(id, owner_id, name, operations) {
        return new AntColony(this._mainEventBus, id, owner_id, name, operations);
    }

}

export { 
    WorldFactory
}