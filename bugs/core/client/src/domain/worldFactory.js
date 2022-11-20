import { Bug } from './entity/bug';
import { World } from './entity/world';
import { Food } from './entity/food';
import { Town } from './entity/town';
import EventEmitter from 'events';

class WorldFactory {

    constructor(mainEventBus) {
        this._mainEventBus = mainEventBus
    }

    buildWorld(worldJson) {
        let initedBugs = [];
        worldJson.bugs.forEach(bugJson => {
            let bug = this.buildBug(bugJson);
            initedBugs.push(bug);
        });

        let foods = []
        worldJson.foods.forEach(foodJson => {
            let food = this.buildFood(foodJson);
            foods.push(food)
        })

        let towns = []
        worldJson.towns.forEach(townJson => {
            let town = this.buildTown(townJson);
            towns.push(town)
        })

        let world = new World(this._mainEventBus, this, initedBugs, foods, towns);

        return world;
    }

    buildBug(bugJson) {
        return new Bug(this._mainEventBus, bugJson.id, bugJson.pos, bugJson.size, bugJson.sight_distance);
    }

    buildFood(foodJson) {
        return new Food(this._mainEventBus, foodJson.id, foodJson.pos, foodJson.size, foodJson.calories);
    }

    buildTown(townJson) {
        return new Town(this._mainEventBus, townJson.id, townJson.pos, townJson.size);
    }
}

export { 
    WorldFactory
}