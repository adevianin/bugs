class TownApi {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
    }

    addNewLarva(townId, larvaType) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'add_larva',
                params: {
                    town_id: townId,
                    larva_type: larvaType
                }
            }
        });
    }
}

export {
    TownApi
}