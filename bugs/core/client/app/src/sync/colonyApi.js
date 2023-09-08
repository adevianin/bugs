class ColonyApi {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
    }

    stopMyColonyOperation(operationId) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'stop_operation',
                params: {
                    operation_id: operationId
                }
            }
        });
    }

    buildNewNest(position) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'build_new_nest',
                params: {
                    position
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