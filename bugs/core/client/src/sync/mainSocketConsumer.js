class MainSocketConsumer {
    constructor(socket, domainFacade) {
        this._socket = socket;
        this._domainFacade = domainFacade;

        this._socket.onopen = this._onOpen.bind(this);
        this._socket.onmessage = this._onMsg.bind(this);
    }

    _onOpen() {
        console.log('connected');
    }

    _onMsg(event) {
        let msg = JSON.parse(event.data);
        switch(msg.type) {
            case 'whole_world':
                this._domainFacade.initWorld(msg.world);
                break;
            case 'entity_changed':
                this._domainFacade.updateEntity(msg.entity);
                break;
            case 'entity_died':
                this._domainFacade.deleteEntity(msg.entity_id);
                break;
            case 'entity_born':
                this._domainFacade.addNewEntity(msg.entity);
                break;
            case 'entity_action':
                this._domainFacade.playAction(msg.action);
                break;
            default: 
                throw `unknown type of message "${ msg.type }"`
        }
    }
}

export {
    MainSocketConsumer
}