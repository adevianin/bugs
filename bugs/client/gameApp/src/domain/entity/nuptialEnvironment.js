import { EventEmitter } from "@common/utils/eventEmitter"

class NuptialEnvironment {

    static build() {
        return new NuptialEnvironment();
    }

    constructor() {
        this.events = new EventEmitter();
        this._nuptialMales = [];
        this._specieData = null;
    }

    get nuptialMales() {
        return this._nuptialMales;
    }

    setNuptialMales(males) {
        this._nuptialMales = males;
    }

    get specieData() {
        return this._specieData;
    }

    setSpecieData(specieData) {
        this._specieData = specieData;
    }

}

export {
    NuptialEnvironment
}