class ColonyApi {

    constructor(requester) {
        this._requester = requester;
    }

    stopOperation(colonyId, operationId) {
        return this._requester.post(`world/colonies/${ colonyId }/operations/${ operationId }/stop_operation`)
    }

    buildNewSubNestOperation(colonyId, buildingSite, workersCount, warriorsCount, nestName) {
        return new Promise((res, rej) => {
            this._requester.post(`world/colonies/${ colonyId }/operations/build_new_sub_nest`, {
                building_site: [buildingSite.x, buildingSite.y],
                workers_count: workersCount,
                warriors_count: warriorsCount,
                nest_name: nestName
            })
            .then(axiosResp => res(null))
            .catch(axiosResp => rej(axiosResp.response.data))
        })
        
    }

    destroyNestOperation(colonyId, warriorsCount, workersCount, nest) {
        return this._requester.post(`world/colonies/${ colonyId }/operations/destroy_nest`, {
            warriors_count: warriorsCount,
            workers_count: workersCount,
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

    bringBugOpearation(colonyId, nestId) {
        return new Promise((res, rej) => {
            this._requester.post(`world/colonies/${ colonyId }/operations/bring_bug`, {
                nest_id: nestId
            })
            .then(axiosResp => res(null))
            .catch(axiosResp => rej(axiosResp.response.data))
        })
    }
}

export {
    ColonyApi
}