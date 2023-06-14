class Colony {

    constructor(id, owner_id) {
        this._id = id;
        this._owner_id = owner_id
    }

    get id() {
        return this._id;
    }

    get ownerId() {
        return this._owner_id;
    }
}

export {
    Colony
}