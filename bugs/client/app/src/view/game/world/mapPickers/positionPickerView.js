import { BasePickerView } from "./basePickerView";

class PositionPickerView extends BasePickerView {

    constructor(container) {
        super(container);

        this.$eventBus.on('positionPickRequest', this._onPickRequest.bind(this));
    }

    _onPickRequest(callback) {
        this._callback = callback;
        this._activate();
    }

    _onPointPick(point) {
        this._callback(point);
        this._deactivate();
    }

}

export {
    PositionPickerView
}