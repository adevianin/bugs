class Colony {

    constructor(id, onwerId) {
        this._id = id;
        this._onwerId = onwerId
    }

    get id() {
        return this._id;
    }

    get ownerId() {
        return this._onwerId;
    }
}

export {
    Colony
}