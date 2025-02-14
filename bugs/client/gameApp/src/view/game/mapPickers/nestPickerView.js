import { BasePickerView } from "./basePickerView";

class NestPickerView extends BasePickerView {

    constructor(container) {
        super(container);
    }

    activate(excludeColonyId, pickableCircle, callback) {
        super.activate(pickableCircle);
        this._callback = callback;
        this._excludeColonyId = excludeColonyId;
    }

    _onPointPick(point) {
        let nest = this.$domainFacade.findNearestNest(point, this._excludeColonyId);

        if (nest) {
            this._callback(nest);
        }
    }

}

export {
    NestPickerView
}