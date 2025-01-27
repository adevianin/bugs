import { BasePickerView } from "./basePickerView";

class NestPickerView extends BasePickerView {

    constructor(container) {
        super(container);

        this.$eventBus.on('nestPickRequest', this._onPickRequest.bind(this));
    }

    _onPickRequest(excludeColonyId, callback) {
        this._callback = callback;
        this._excludeColonyId = excludeColonyId;
        this._activate();
    }

    _onPointPick(point) {
        let nest = this.$domainFacade.findNearestNest(point, this._excludeColonyId);

        if (nest) {
            this._callback(nest);
            this._deactivate();
        }
    }

}

export {
    NestPickerView
}