class ColonyApi {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
    }

    stopOperation(colonyId, operationId) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'stop_operation',
                params: {
                    operation_id: operationId,
                    colony_id: colonyId
                }
            }
        });
    }

    buildNewSubNestOperation(performingColonyId, buildingSite, workersCount) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'build_new_sub_nest',
                params: {
                    performing_colony_id: performingColonyId,
                    building_site: buildingSite,
                    workers_count: workersCount
                }
            }
        });
    }

    destroyNestOperation(performingColonyId, warriorsCount, nest) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'destroy_nest',
                params: {
                    performing_colony_id: performingColonyId,
                    warriors_count: warriorsCount,
                    nest_id: nest.id
                }
            }
        });
    }

    pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'pillage_nest',
                params: {
                    performing_colony_id: performingColonyId,
                    nest_to_pillage_id: pillagingNestId,
                    nest_for_loot_id: nestForLootId,
                    warriors_count: warriorsCount,
                    workers_count: workersCount
                }
            }
        });
    }
}

export {
    ColonyApi
}