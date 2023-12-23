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

    buildNewSubNestOperation(colonyId, buildingSite, workersCount) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'build_new_sub_nest',
                params: {
                    colony_id: colonyId,
                    building_site: buildingSite,
                    workers_count: workersCount
                }
            }
        });
    }

    destroyNestOperation(nest) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'destroy_nest',
                params: {
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