import { Bug } from './entity/bug';
import { World } from './entity/world';
import { Block } from './entity/block';

class WorldFactory {

    buildWorld(worldJson) {
        let initedBugs = [];
        worldJson.bugs.forEach(bugJson => {
            let bug = this.buildBug(bugJson);
            initedBugs.push(bug);
        });

        let initedBlocks = [];
        worldJson.blocks.forEach(blockJson => {
            let block = this.buildBlock(blockJson);
            initedBlocks.push(block);
        });

        let world = new World(initedBugs, initedBlocks);

        return world;
    }

    buildBug(bugJson) {
        return new Bug(bugJson.id, bugJson.pos, bugJson.size);
    }

    buildBlock(blockJson) {
        return new Block(blockJson.id, blockJson.pos, blockJson.size);
    }
}

export { 
    WorldFactory
}