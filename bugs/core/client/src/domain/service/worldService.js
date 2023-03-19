class WorldService {

    constructor(world, worldFactory) {
        this._world = world;
        this._worldFactory = worldFactory;
    }

    initWorld(worldJson) {
        worldJson.entities.forEach(entityJson => { this.addNewEntity(entityJson); });
    }

    getEntities() {
        return this._world.entities;
    }

    updateEntity(entityJson) {
        this._world.updateEntity(entityJson);
    }

    addNewEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
    }
}

export {
    WorldService
};