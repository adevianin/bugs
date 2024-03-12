import { EventEmitter } from "@utils/eventEmitter";

class SpecieBuilder extends EventEmitter {

    constructor(specieBuilderApi) {
        super();
        this._specieBuilderApi = specieBuilderApi;
        this._isLoaded = false;
    }

    load() {
        if (!this._isLoaded) {
            this.emit('loadingStart');
            this._specieBuilderApi.loadBuilderData().then((genesEntries, schema) => {
                this._genesEntries = genesEntries;
                this._schema = schema;
                this.emit('loadingEnd');
            })
        }
    }
}

export {
    SpecieBuilder
}