import { EntityTypes } from './entityTypes';

class World {
    constructor(mainEventBus, worldFactory, bugs, towns, foodAreas) {
        this._bugs = bugs;
        this._towns = towns
        this._worldFactory = worldFactory
        this._mainEventBus = mainEventBus
        this._foodAreas = foodAreas

        // this._mainEventBus.on('eaten', this._onFoodEaten.bind(this))
    }

    get bugs() {
        return [...this._bugs];
    }

    get towns() {
        return [...this._towns]
    }

    get foodAreas() {
        return [...this._foodAreas]
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
        let bug = this._bugs.find(b => { return b.id === id });
        if (bug) { return bug }

        return this._foodAreas.find(f => { return f.id === id });
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

    // _onFoodEaten(food) {
    //     for (let i = 0; i < this._foods.length; i++) {
    //         if (this._foods[i].id == food.id) {
    //             this._foods.splice(i, 1)
    //         }
    //     }
    // }
}

export { World }