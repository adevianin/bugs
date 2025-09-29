import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";

class CommandMessenger {

    constructor(serverConnection) {
        this._serverConnection = serverConnection;
        this._lastUsedCommandId = 0;
        this._pendingCommands = {};

        this._serverConnection.events.on('message', this._onMessage.bind(this));
    }

    sendPlayerCommand(type, data) {
        return this._sendCommand(type, data);
    }

    _sendCommand(type, data = {}) {
        let id = this._lastUsedCommandId + 1;
        this._lastUsedCommandId = id;

        this._serverConnection.send({
            id, 
            type: 'player_command',
            player_command_type: type,
            data
        });

        return new Promise((res, rej) => {
            this._pendingCommands[id] = {
                setResult: (result) => {
                    res(result);
                },
                setError: (err) => {
                    rej(err);
                }
            };
        });
    }

    _onMessage(msg) {
        if (msg.type != 'command_result') {
            return;
        }
        let data = msg.data;

        let commandResolver = this._pendingCommands[msg.id];
        if (commandResolver) {
            delete this._pendingCommands[msg.id];
            if (msg.success) {
                commandResolver.setResult(data);
            } else {
                switch (data.err_type) {
                    case 'state_conflict_error':
                        commandResolver.setError(new ConflictRequestError({step: data.step}));
                        break;
                    case 'engine_error':
                    case 'unknown':
                        commandResolver.setError(new GenericRequestError());
                }
            }
        }
    }

}

export {
    CommandMessenger
}