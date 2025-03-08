class MessageMaster {

    static _instance = null

    static init(msgLibrariesPack) {
        if (MessageMaster._instance) {
            throw 'Message Master is inited already';
        }
        let lang = MessageMaster._determineLang();
        MessageMaster._instance = new MessageMaster(msgLibrariesPack[lang]);
    }

    static _determineLang() {
        return navigator.language || 'en';
    }

    static get(msgId) {
        return MessageMaster._instance.get(msgId);
    }

    // 'максимальна довжина {0} символів, від {1} до {2}'
    // format(str, 5, 10, 20)
    static format(msgId, ...values) {
        return MessageMaster._instance.format(msgId, ...values);
    }

    constructor(msgLibrary) {
        this._msgLibrary = msgLibrary;
    }

    get(msgId) {
        if (!this._msgLibrary[msgId]) {
            console.warn(`Message ID "${msgId}" not found`);
            return msgId;
        }
        return this._msgLibrary[msgId];
    }

    format(msgId, ...values) {
        let msgTemplate = this._msgLibrary[msgId];
        return msgTemplate.replace(/{(\d+)}/g, (_, index) => values[index] || '');
    }
}

export {
    MessageMaster
}