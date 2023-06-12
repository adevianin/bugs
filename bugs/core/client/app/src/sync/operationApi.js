class OperationApi {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
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
    OperationApi
}