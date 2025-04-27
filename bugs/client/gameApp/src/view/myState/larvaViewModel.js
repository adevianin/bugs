import { BaseViewModel } from "./baseViewModel";

class LarvaViewModel extends BaseViewModel {

    get id() {
        return this._props.id;
    }

    get name() {
        return this._props.name;
    }

    get antType() {
        return this._props.antType;
    }

    get ateFood() {
        return this._props.ateFood;
    }

    set ateFood(val) {
        this._props.ateFood = val;
        this.emit('progressChanged')
    }

    get isDied() {
        return this.ateFood < 0;
    }

    get requiredFood() {
        return this._props.requiredFood;
    }

    get genome() {
        return this._props.genome;
    }

    applyPatch(patch) {
        this._applyProps(patch.props);
    }

}

export {
    LarvaViewModel
}