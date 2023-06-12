class NestApi {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
    }

    addNewLarva(nestId, larvaType) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'add_larva',
                params: {
                    nest_id: nestId,
                    larva_type: larvaType
                }
            }
        });
    }
}

export {
    NestApi
}