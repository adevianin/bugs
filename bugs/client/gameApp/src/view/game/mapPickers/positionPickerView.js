import { BasePickerView } from "./basePickerView";

class PositionPickerView extends BasePickerView {

    constructor(container) {
        super(container);
    }

    activate(callback) {
        super.activate();
        this._callback = callback;
    }

    _onPointPick(point) {
        this._callback(point);
    }

}

export {
    PositionPickerView
}