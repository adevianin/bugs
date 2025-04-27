import { BaseViewModel } from "./baseViewModel";
import { EggStates } from "@domain/enum/eggStates";

class EggViewModel extends BaseViewModel {

    get id() {
        return this._props.id;
    }

    get name() {
        return this._props.name;
    }

    set name(val) {
        this._props.name = val;
    }

    get genome() {
        return this._props.genome;
    }

    get progress() {
        return this._props.progress;
    }

    set progress(val) {
        this._props.progress = val;
        this.emit('progressChanged');
    }

    get state() {
        return this._props.state;
    }

    set state(val) {
        this._props.state = val;
    }

    get antType() {
        return this._props.antType;
    }

    set antType(val) {
        this._props.antType = val;
    }

    get isReady() {
        return this.state == EggStates.READY;
    }

    get isDevelopment() {
        return this.state == EggStates.DEVELOPMENT;
    }

    get isSpoiled() {
        return this.state == EggStates.SPOILED;
    }

    get isFertilized() {
        return this._props.isFertilized;
    }

    get avaliableAntTypes() {
        return this._props.avaliableAntTypes;
    }

    applyPatch(patch) {
        this._applyProps(patch.props);
    }

}

export {
    EggViewModel
}