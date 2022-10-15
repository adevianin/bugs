import { Bug } from './entity/bug';
import { World } from './entity/world';

class WorldFactory {

    buildWorld(worldJson) {
        let initedBugs = [];
        worldJson.bugs.forEach(bugJson => {
            let bug = this.buildBug(bugJson);
            initedBugs.push(bug);
        });

        let world = new World(initedBugs);

        return world;
    }

    buildBug(bugJson) {
        return new Bug(bugJson.id, bugJson.pos, bugJson.size);
    }
}

export { 
    WorldFactory
}