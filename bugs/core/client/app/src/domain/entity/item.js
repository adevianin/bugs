import { Entity } from "./entity"
import { EntityTypes } from "../enum/entityTypes";
import { ACTION_TYPES } from "./action/actionTypes";
import { walker } from "utils/walker"; 

class Item extends Entity {
    
    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, itemType, itemVariety, isPicked) {
        super(eventBus, id, position, angle, EntityTypes.ITEM, fromColony, hp, maxHp);
        this._itemType = itemType;
        this._itemVariety = itemVariety;
        this._isPicked = isPicked;
    }

    get itemType() {
        return this._itemType;
    }

    get itemVariety() {
        return this._itemVariety;
    }

    get isPicked() {
        return this._isPicked;
    }

    set isPicked(value) {
        this._isPicked = value;
        this.emit('isPickedChanged');
    }

    playAction(action) {
        let promise = super.playAction(action)
        if (promise) {
            return promise
        }
        switch (action.type) {
            case ACTION_TYPES.ITEM_WAS_PICKED_UP:
                return this._playItemPickedUp(action);
            case ACTION_TYPES.ITEM_WAS_DROPPED:
                return this._playItemDrop(action);
            case ACTION_TYPES.ITEM_BEING_BRINGED:
                return this._playItemBeingBringed(action);
        }
    }

    _playEntityDied(action) {
        this._setState('dead');
        this.die();
        return Promise.resolve();
    }

    _playItemPickedUp(action) {
        return new Promise((res) => {
            this.isPicked = true;
            res();
        });
    }
    
    _playItemDrop(action) {
        return new Promise((res) => {
            this.isPicked = false;
            let pos = action.actionData.position;
            this.setPosition(pos.x, pos.y);
            res();
        });
    }

    _playItemBeingBringed(action) {
        let newPos = action.actionData.new_position;
        let userSpeed = action.actionData.bring_user_speed;
        return walker(this._position, newPos, userSpeed, (x, y) => {
            this.setPosition(x, y);
        });
    }

}

export {
    Item
}