import { EntityTypes } from './entity/entityTypes'
import { Bug } from './entity/bug';
import { World } from './entity/world';
import { Town } from './entity/town';
import { Food } from './entity/food';

class WorldFactory {

    buildWorldFromJson(worldJson) {
        let entities = [];
        worldJson.entities.forEach(entityJson => {
            let entity = this.buildEntity(entityJson);
            entities.push(entity);
        });

        let world = this.buildWorld(entities);

        return world;
    }

    buildWorld(entities) {
        return new World(entities);
    }

    buildBug(id, position) {
        return new Bug(id, position);
    }

    buildTown(id, position, color) {
        return new Town(id, position, color);
    }

    buildFood(id, position, calories) {
        return new Food(id, position, calories);
    }

    buildEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.BUG:
                return this.buildBug(entityJson.id, entityJson.position);
            case EntityTypes.TOWN:
                return this.buildTown(entityJson.id, entityJson.position, entityJson.color);
            case EntityTypes.FOOD:
                return this.buildFood(entityJson.id, entityJson.position, entityJson.calories);
            default:
                throw 'unknown type of entity';
        }
    }
}

export { 
    WorldFactory
}