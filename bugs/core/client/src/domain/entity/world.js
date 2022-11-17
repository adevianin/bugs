import { EntityTypes } from './entityTypes';

class World {
    constructor(worldFactory, bugs, foods) {
        this._bugs = bugs;
        this._foods = foods
        this._worldFactory = worldFactory
    }

    get bugs() {
        return [...this._bugs];
    }

    get foods() {
        return [...this._foods]
    }

    updateEntity(entityJson) {
        let entity = this._findEntityById(entityJson.id);
        if (entity) {
            entity.updateEntity(entityJson);
        } else {
            this._buildNewcameEntity(entityJson)
        }
    }

    _findEntityById(id) {
        return this._bugs.find(b => { return b.id === id });
    }

    _buildNewcameEntity(entityJson) {
        switch(entityJson.type) {
            case EntityTypes.BUG:
                this._bugs.push(this._worldFactory.buildBug(entityJson));
                break;
            case EntityTypes.FOOD:
                this._foods.push(this._worldFactory.buildFood(entityJson))
                break;
            default:
                throw `unknown type of entity "${ entityJson.type }"`
        }
    }
}

export { World }