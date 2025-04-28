import { EntityTypes } from "@domain/enum/entityTypes";
import { AntTypes } from "@domain/enum/antTypes";

class EntitySerializer {

    setUserData(userData) {
        this._userData = userData;
    }

    serializeAnyEntities(entities) {
        let serializedEntities = [];
        for (let entity of entities) {
            serializedEntities.push(this.serializeAnyEntity(entity));
        }
        return serializedEntities;
    }

    serializeAnyEntity(entity) {
        switch (entity.type) {
            case EntityTypes.ANT:
                return this.serializeAnt(entity);
            case EntityTypes.ITEM:
                return this.serializeItem(entity);
            case EntityTypes.ITEM_AREA:
                return this.serializeItemArea(entity);
            case EntityTypes.ITEM_SOURCE:
                return this.serializeItemSource(entity);
            case EntityTypes.LADYBUG:
                return this.serializeLadybug(entity);
            case EntityTypes.NEST:
                return this.serializeNest(entity);
            case EntityTypes.TREE:
                return this.serializeTree(entity);
        }
    }

    serializeItemArea(itemArea) {
        let json = this._serializeBaseEntity(itemArea);
        return json;
    }

    serializeTree(tree) {
        let json = this._serializeBaseEntity(tree);
        return json;
    }

    serializeLadybug(ladybug) {
        let json = this._serializeLiveEntity(ladybug);
        json = Object.assign(json, {
        });
        return json;
    }

    serializeItemSource(itemSource) {
        let json = this._serializeBaseEntity(itemSource);
        json = Object.assign(json, {
            itemType: itemSource.itemType,
            isDamaged: itemSource.isDamaged,
            accumulated: itemSource.accumulated,
            maxAccumulated: itemSource.maxAccumulated,
            fertility: itemSource.fertility
        });
        return json;
    }

    serializeItem(item) {
        let json = this._serializeBaseEntity(item);
        json = Object.assign(json, {
            itemType: item.itemType,
            itemVariety: item.itemVariety,
            isPicked: item.isPicked,
            isBringing: item.isBringing
        });
        return json;
    }

    serializeAnt(ant) {
        switch (ant.antType) {
            case AntTypes.MALE:
                return this._serializeMaleAnt(ant);
            case AntTypes.QUEEN:
                return this._serializeQueenAnt(ant);
            case AntTypes.WARRIOR:
                return this._serializeWarriorAnt(ant);
            case AntTypes.WORKER:
                return this._serializeWorkerAnt(ant);
            default:
                throw 'unknown type of ant';
        }
    }

    serializeAnts(ants) {
        let serializedAnts = [];
        for (let ant of ants) {
            serializedAnts.push(this.serializeAnt(ant));
        }
        return serializedAnts;
    }

    _serializeMaleAnt(ant) {
        let json = this._serializeBaseAnt(ant);
        return json;
    }

    _serializeQueenAnt(ant) {
        let json = this._serializeBaseAnt(ant);
        json = Object.assign(json, {
            isFertilized: ant.isFertilized,
            breedingMaleGenome: ant.breedingMaleGenome ? this.serializeGenome(ant.breedingMaleGenome) : null,
        });
        return json;
    }

    _serializeWarriorAnt(ant) {
        let json = this._serializeBaseAnt(ant);
        return json;
    }

    _serializeWorkerAnt(ant) {
        let json = this._serializeBaseAnt(ant);
        return json;
    }

    _serializeBaseAnt(ant) {
        let json = this._serializeLiveEntity(ant);
        json = Object.assign(json, {
            name: ant.name,
            antType: ant.antType,
            stats: ant.stats,
            genome: this.serializeGenome(ant.genome),
            birthStep: ant.birthStep,
            currentActivity: ant.currentActivity,
            isHungry: ant.isHungry,
            pickedItemId: ant.pickedItemId,
            homeNestId: ant.homeNestId,
            guardianBehavior: ant.guardianBehavior,
            isCooperativeBehavior: ant.isCooperativeBehavior,
            isQueenOfColony: ant.isQueenOfColony,
            canFlyNuptialFlight: ant.canFlyNuptialFlight,
            canBeCooperative: ant.canBeCooperative,
            canBeGuardian: ant.canBeGuardian,
        });
        return json;
    }

    serializeNests(nests) {
        let serializedNests = [];
        for (let nest of nests) {
            serializedNests.push(this.serializeNest(nest));
        }
        return serializedNests;
    }

    serializeNest(nest) {
        let json = this._serializeBaseEntity(nest);
        json = Object.assign(json, {
            storedCalories: nest.storedCalories,
            fortification: nest.fortification,
            maxFortification: nest.maxFortification,
            name: nest.name,
            isMain: nest.isMain,
            area: nest.area,
            isBuilt: nest.isBuilt,
            larvae: this.serializeLarvae(nest.larvae),
            eggs: this.serializeEggs(nest.eggs)
        });
        return json;
    }

    serializeEggs(eggs) {
        let serializedEggs = [];
        for (let egg of eggs) {
            serializedEggs.push(this.serializeEgg(egg));
        }
        return serializedEggs;
    }

    serializeEgg(egg) {
        return {
            id: egg.id,
            name: egg.name,
            genome: this.serializeGenome(egg.genome),
            progress: egg.progress,
            state: egg.state,
            antType: egg.antType,
            isFertilized: egg.isFertilized,
            avaliableAntTypes: egg.avaliableAntTypes,
        }
    }
    
    serializeLarvae(larvae) {
        let serialized = []
        for (let larva of larvae) {
            serialized.push(this.serializeLarva(larva));
        }
        return serialized;
    }

    serializeLarva(larva) {
        return {
            id: larva.id,
            name: larva.name,
            antType: larva.antType,
            ateFood: larva.ateFood,
            requiredFood: larva.requiredFood,
            genome: this.serializeGenome(larva.genome)
        };
    }

    serializeGenome(genome) {
        return {
            maternal: this.serializeChromosomesSet(genome.maternal),
            paternal: genome.paternal ? this.serializeChromosomesSet(genome.paternal) : null,
        };
    }

    serializeChromosomesSet(chromosomesSet) {
        return chromosomesSet.chromosomes;
    }

    _serializeBaseEntity(entity) {
        return {
            id: entity.id,
            position: entity.position,
            type: entity.type,
            fromColony: entity.fromColony,
            isMine: this._userData.id == entity.ownerId,
            hp: entity.hp,
            maxHp: entity.maxHp,
            isDied: entity.isDied,
            isVisible: entity.isVisible,
            angle: entity.angle
        }
    }

    _serializeLiveEntity(entity) {
        let json = this._serializeBaseEntity(entity);
        json = Object.assign(json, {
            isInHibernation: entity.isInHibernation
        });
        return json;
    }
}

export {
    EntitySerializer
}