class MessageMaster {

    static build(msgLibrariesPack) {
        let lang = MessageMaster._determineLang();
        return new MessageMaster(msgLibrariesPack[lang]);
    }

    static _determineLang() {
        return navigator.language || 'en';
    }

    constructor(msgLibrary) {
        this._msgLibrary = msgLibrary;
    }

    get(msgId) {
        return this._msgLibrary[msgId];
    }

    // 'максимальна довжина {0} символів, від {1} до {2}'
    // format(str, 5, 10, 20)
    format(msgId, ...values) {
        let msgTemplate = this._msgLibrary[msgId];
        return msgTemplate.replace(/{(\d+)}/g, (_, index) => values[index] || '');
    }
}

export {
    MessageMaster
}