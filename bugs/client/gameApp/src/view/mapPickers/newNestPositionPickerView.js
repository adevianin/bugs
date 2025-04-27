import { BasePickerView } from "./basePickerView";
import { distance_point } from "@utils/distance";

class NewNestPositionPickerView extends BasePickerView {

    activate(mainNestPosition, callback) {
        super.activate();
        this._mainNestPosition = mainNestPosition;
        this._callback = callback;
        this._stopListenBgClick = this.$eventBus.on('bgclick', this._onBgClick.bind(this));

        this._updateArea();
    }

    deactivate() {
        super.deactivate();
        this._stopListenBgClick();
    }

    async _prepareAreaData() {
        let { area, exclusions } = await this.$domain.getNestBuildableArea(this._mainNestPosition);
        this._updateAreaData(area, exclusions);
    }

    _onBgClick(point) {
        if (this._pickableCircle) {
            let dist = distance_point(this._pickableCircle.center, point);
            if (dist >= this._pickableCircle.radius) {
                return;
            }
        }

        if (this._exclusions) {
            for (let exclusion of this._exclusions) {
                let dist = distance_point(exclusion.center, point);
                if (dist < exclusion.radius) {
                    return;
                }
            }
        }

        this._callback(point);
    }

}

export {
    NewNestPositionPickerView
}