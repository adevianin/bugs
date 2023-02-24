class Entity {

    constructor(id, position, type) {
        this.id = id;
        this._position = position;
        this.type = type;
        this._actionStack = [];
        this._isPlaying = false;
        this._isHidden = false;
    }

    setPosition(x, y) {
        this._position = {x, y};
    }

    get position(){
        return this._position;
    }

    updateEntity(entityJson) {
    }

    addAction(action) {
        this._actionStack.push(action);
        this._handleActionsByTimeReducer();
        this.tryPlayNextAction();
    }

    playAction(action) {}

    tryPlayNextAction() {
        if (this._actionStack.length == 0 || this._isPlaying) {
            return
        }
        let nextAction = this._actionStack[0];
        this._actionStack.shift();

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

    _handleActionsByTimeReducer() {
        if (this._actionStack.length <= 3) {
            return;
        }
        let actionTimeReducer;
        if (this._actionStack.length == 4) {
            actionTimeReducer = 0.9;
        }
        if (this._actionStack.length == 5) {
            actionTimeReducer = 0.7;
        }
        if (this._actionStack.length > 5) {
            actionTimeReducer = 0.5;
        }
        this._actionStack.forEach(action => {
            action.time *= actionTimeReducer;
        });
    }

}

export {
    Entity
}