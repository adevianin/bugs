import { Bug } from './entity/bug';
import { World } from './entity/world';
import { Food } from './entity/food';

class WorldFactory {

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

        let world = new World(this, initedBugs, foods);

        return world;
    }

    buildBug(bugJson) {
        return new Bug(bugJson.id, bugJson.pos, bugJson.size);
    }

    buildFood(foodJson) {
        return new Food(foodJson.id, foodJson.pos, foodJson.size, foodJson.calories);
    }
}

export { 
    WorldFactory
}