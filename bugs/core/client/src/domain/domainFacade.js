import { WorldFactory } from './worldFactory';
import { ActionFactory } from './entity/action/actionFactory';
import EventEmitter from 'events';

class DomainFacade {

    constructor() {
        this._world = null;
        this._worldFactory = null;
        this._actionFactory = null;
    }

    initWorld(worldJson) {
        let mainEventBus = new EventEmitter();
        this._worldFactory = new WorldFactory(mainEventBus);
        this._world = this._worldFactory.buildWorldFromJson(worldJson);
        this._actionFactory = new ActionFactory(this._world);
    }

    updateEntity(entityJson) {
        this._world.updateEntity(entityJson);
    }

    deleteEntity(entityId) {
        this._world.deleteEntity(entityId);
    }

    addNewEntity(entityJson) {
        let entity = this._worldFactory.buildEntity(entityJson);
        this._world.addEntity(entity);
    }

    playAction(actionJson) {
        let action = this._actionFactory.buildAction(actionJson);
        this._world.playAction(action);
    }

    getEntities() {
        return this._world.entities;
    }

}
export { DomainFacade }