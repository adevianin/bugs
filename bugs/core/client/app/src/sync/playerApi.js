class PlayerApi {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
    }

    generateNuptialMales() {
        this._serverConnection.send({
            type: 'command',
            command: {
                command_type: 'generate_nuptial_males'
            }
        });
    }

}

export {
    PlayerApi
}