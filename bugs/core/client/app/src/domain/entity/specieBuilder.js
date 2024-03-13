import { EventEmitter } from "@utils/eventEmitter";

class SpecieBuilder extends EventEmitter {

    constructor(specieBuilderApi) {
        super();
        this._specieBuilderApi = specieBuilderApi;
    }

    load() {
        return this._specieBuilderApi.loadBuilderData().then((geneEntries, schema) => {
            this._geneEntries = geneEntries;
            this._schema = schema;
        });
    }

    get
}

export {
    SpecieBuilder
}