class AntApi {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
    }

    flyNuptialFlight(antId) {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'fly_nuptial_flight',
                params: {
                    ant_id: antId
                }
            }
        });
    }
}

export {
    AntApi
}