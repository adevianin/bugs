import { Entity } from "./entity"
import { EntityTypes } from "../enum/entityTypes";
import { ACTION_TYPES } from "./action/actionTypes";
import { entityWalker } from "@utils/entityWalker"; 

class Item extends Entity {
    
    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, itemType, itemVariety, isPicked, isBringing) {
        super(eventBus, id, position, angle, EntityTypes.ITEM, fromColony, null, hp, maxHp);
        this._itemType = itemType;
        this._itemVariety = itemVariety;
        this._isPicked = isPicked;
        this._isBringing = isBringing;
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

    get isBringing() {
        return this._isBringing;
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
            case ACTION_TYPES.ITEM_BRINGING_STATE_CHANGED:
                return this._playItemBringingStateChanged(action);
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

    async _playItemBeingBringed(action) {
        await this._requestActionAnimation(ACTION_TYPES.ITEM_BEING_BRINGED, {
            destinationPosition: action.new_position,
            userSpeed: action.bring_user_speed
        });
    }

    _playItemBringingStateChanged(action) {
        this._isBringing = action.isBringing;
        return Promise.resolve();
    }

}

export {
    Item
}