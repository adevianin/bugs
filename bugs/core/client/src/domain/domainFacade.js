class DomainFacade {

    constructor(worldFactory) {
        this._worldFactory = worldFactory;
        this._world = null;
    }

    initWorld(worldJson) {
        console.log(worldJson)
        this._world = this._worldFactory.buildWorld(worldJson);
    }

    updateEntity(entityJson) {
        this._world.updateEntity(entityJson);
    }

    get world() {
        return this._world;
    }

}
export { DomainFacade }