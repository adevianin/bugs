class OperationApi {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
    }

    buildNewTown(position) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'build_new_town',
                params: {
                    position
                }
            }
        });
    }
}

export {
    OperationApi
}