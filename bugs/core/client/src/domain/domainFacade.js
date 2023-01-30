class DomainFacade {

    constructor(worldFactory) {
        this._worldFactory = worldFactory;
        this._world = null;
    }

    initWorld(worldJson) {
        console.log(worldJson)
        this._world = this._worldFactory.buildWorldFromJson(worldJson);
    }

    updateEntity(entityJson) {
        this._world.updateEntity(entityJson);
    }

    deleteEntity(entityId) {
        this._world.deleteEntity(entityId);
    }

    getEntities() {
        return this._world.entities;
    }

}
export { DomainFacade }