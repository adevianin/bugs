class WorldStepEventsCollector {

    constructor(eventBus) {
        this._eventBus = eventBus;
        this._stepEvents = [];

        this._eventBus.on('nestDied', this._onNestDied.bind(this));
    }

    pullStepEvents() {
        let evetns = this._stepEvents;
        this._stepEvents = [];
        return evetns;
    }

    _onNestDied(nest) {
        this._stepEvents.push(this._buildEventRecord('nestDied', {nestId: nest.id}));
    }

    _buildEventRecord(type, data) {
        return {
            type,
            data
        };
    }
}

export {
    WorldStepEventsCollector
}