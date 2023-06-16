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
}

export {
    ColonyApi
}