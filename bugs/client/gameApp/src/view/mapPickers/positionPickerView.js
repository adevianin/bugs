import { BasePickerView } from "./basePickerView";

class PositionPickerView extends BasePickerView {

    constructor(container) {
        super(container);
    }

    activate(pickableCircle, exclusions, callback) {
        super.activate(pickableCircle, exclusions);
        this._callback = callback;
    }

    _onPointPick(point) {
        this._callback(point);
    }

}

export {
    PositionPickerView
}