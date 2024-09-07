class ColonyApi {

    constructor(requester) {
        this._requester = requester;
    }

    stopOperation(colonyId, operationId) {
        return this._requester.post(`world/colonies/${ colonyId }/operations/${ operationId }/stop_operation`)
    }

    buildNewSubNestOperation(colonyId, buildingSite, workersCount) {
        return this._requester.post(`world/colonies/${ colonyId }/operations/build_new_sub_nest`, {
            building_site: [buildingSite.x, buildingSite.y],
            workers_count: workersCount
        })
    }

    destroyNestOperation(colonyId, warriorsCount, nest) {
        return this._requester.post(`world/colonies/${ colonyId }/operations/destroy_nest`, {
            warriors_count: warriorsCount,
            nest_id: nest.id
        })
    }

    pillageNestOperation(colonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        return this._requester.post(`world/colonies/${ colonyId }/operations/pillage_nest`, {
            nest_to_pillage_id: pillagingNestId,
            nest_for_loot_id: nestForLootId,
            warriors_count: warriorsCount,
            workers_count: workersCount
        })
    }

    transportFoodOperation(colonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        return this._requester.post(`world/colonies/${ colonyId }/operations/transport_food`, {
            from_nest_id: fromNestId,
            to_nest_id: toNestId,
            workers_count: workersCount,
            warriors_count: warriorsCount,
        });
    }

    buildFortificationsOpearation(colonyId, nestId, workersCount) {
        return this._requester.post(`world/colonies/${ colonyId }/operations/build_fortification`, {
            nest_id: nestId,
            workers_count: workersCount
        });
    }
}

export {
    ColonyApi
}