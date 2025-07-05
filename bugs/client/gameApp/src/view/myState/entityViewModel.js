import { BaseViewModel } from "./baseViewModel";

class EntityViewModel extends BaseViewModel {

    get id() {
        return this._props.id;
    }

    get position() {
        return this._props.position;
    }

    set position(newPos) {
        this._props.position = newPos;
        this.emit('positionChanged');
    }

    get fromColony() {
        return this._props.fromColony;
    }

    set fromColony(id) {
        this._props.fromColony = id;
        // this.emit('fromColonyChanged');
        this.$eventBus.emit('entityGotInColony', id, this);
    }

    get type() {
        return this._props.type;
    }

}

export {
    EntityViewModel
}