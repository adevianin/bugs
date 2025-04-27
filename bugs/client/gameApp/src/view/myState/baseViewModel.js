import { EventEmitter } from "@common/utils/eventEmitter";

class BaseViewModel extends EventEmitter {

    static buildFromJson(json) {
        return new this(json);
    }

    constructor (props) {
        super();
        this._props = props;
    }

    _applyProps(props) {
        for (let propName in props) {
            let propValue = props[propName];
            this[propName] = propValue;
        }
    }

    applyPatch(patch) {
        this._applyProps(patch.props);
    }

}

export {
    BaseViewModel
}