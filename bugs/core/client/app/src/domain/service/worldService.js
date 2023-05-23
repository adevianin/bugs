class WorldService {

    constructor(world, worldFactory, mainEventBus) {
        this._world = world;
        this._worldFactory = worldFactory;
        this._mainEventBus = mainEventBus;
        this._isWholeWorldInited = false;
        this._worldSize = null;
    }

    get world() {
        return this._world;
    }

    initWorld(worldJson) {
        worldJson.entities.forEach(entityJson => { 
            let entity = this._worldFactory.buildEntity(entityJson);
            this._world.addEntity(entity); 
        });
        this._world.size = worldJson.size;

        this._runAnts();

        this._isWholeWorldInited = true;
        this._mainEventBus.emit('wholeWorldInited');
    }

    getEntities() {
        return this._world.entities;
    }

    giveBirthToEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
        this._mainEventBus.emit('entityBorn', entity);
    }

    clear() {
        this._world.clear();
        this._isWholeWorldInited = false;
    }

    isWholeWorldInited() {
        return this._isWholeWorldInited;
    }

    _runAnts() {
        let ants = this._world.getAnts();

        //put food in bugs hands
        ants.forEach(ant => {
            if (ant.pickedFoodId) {
                let food = this._world.findEntityById(ant.pickedFoodId);
                ant.pickupFood(food);
            }
        });
        
    }
}

export {
    WorldService
};