import { EventEmitter } from "utils/eventEmitter";

class Entity extends EventEmitter {

    constructor(eventBus, id, position, type) {
        super();
        this._eventBus = eventBus;
        this.id = id;
        this._position = position;
        this.type = type;
        this._actionStack = [];
        this._isPlaying = false;
        this._isHidden = false;
    }

    get state() {
        return this._state;
    }

    setPosition(x, y) {
        this._position = {x, y};
        this.emit('positionChanged');
    }

    get position(){
        return this._position;
    }

    addAction(action) {
        this._actionStack.push(action);
        this.tryPlayNextAction();
    }

    playAction(action) {}

    tryPlayNextAction() {
        if (this._actionStack.length == 0 || this._isPlaying) {
            return
        }
        let nextAction = this._actionStack[0];
        this._actionStack.shift();
        this.START_PLAYING_AT = new Date().getTime()
        this._isPlaying = true;
        this.playAction(nextAction)
            .then(() => {
                this._isPlaying = false;
                this.tryPlayNextAction();
            });
    }

    isHidden() {
        return this._isHidden;
    }

    toggleHidden(isHidden) {
        this._isHidden = isHidden;
    }

    globalEmit(eventName, data) {
        this._eventBus.emit(eventName, data);
    }

    die() {
        this.globalEmit('died', this);//to delete entity from world
        this.emit('died');//to delete view
    }

    _setState(newState) {
        let isStateDifferent = this._state != newState;
        this._state = newState;
        if (isStateDifferent) {
            this.emit('stateChanged');
        }
    }

}

export {
    Entity
}