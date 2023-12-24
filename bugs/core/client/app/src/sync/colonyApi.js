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

    pillageNestOperation(pillagingNest, unloadingNest) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'pillage_nest',
                params: {
                    pillaging_nest_id: pillagingNest.id,
                    unloading_nest_id: unloadingNest.id
                }
            }
        });
    }
}

export {
    ColonyApi
}