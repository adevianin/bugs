import { Entity } from "./entity"
import { EntityTypes } from "../enum/entityTypes";
import { ACTION_TYPES } from "./action/actionTypes";

class Item extends Entity {
    
    constructor(eventBus, id, position, angle, fromColony, hp, maxHp, itemType, itemVariety, isPicked, isBringing) {
        super(eventBus, id, position, angle, EntityTypes.ITEM, fromColony, null, hp, maxHp);
        this._itemType = itemType;
        this._itemVariety = itemVariety;
        this._isPicked = isPicked;
        this._isBringing = isBringing;
    }

    get isVisible() {
        return super.isVisible && !this.isPicked;
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
        this.die();
        return Promise.resolve();
    }

    async _playItemPickedUp(action) {
        this.isPicked = true;
        this._requestActionAnimation(ACTION_TYPES.ITEM_WAS_PICKED_UP);
    }
    
    async _playItemDrop(action) {
        this.isPicked = false;
        let pos = action.actionData.position;
        this.setPosition(pos.x, pos.y);
        this._requestActionAnimation(ACTION_TYPES.ITEM_WAS_DROPPED, {
            dropPosition: pos
        });
    }

    async _playItemBeingBringed(action) {
        this._requestActionAnimation(ACTION_TYPES.ITEM_BEING_BRINGED, {
            pointFrom: this.position, 
            pointTo: action.new_position,
            userSpeed: action.bring_user_speed
        });
        this.setPosition(action.new_position.x, action.new_position.y);
    }

    _playItemBringingStateChanged(action) {
        this._isBringing = action.isBringing;
        return Promise.resolve();
    }

}

export {
    Item
}