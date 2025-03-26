import { BasePickerView } from './basePickerView';
import { ChunksVisibilityManager } from "@view/world/chunksVisibilityManager";
import * as PIXI from 'pixi.js';

class RaidNestPickerView extends BasePickerView {

    activate(raidingColonyId, raidAreaCenter, callback) {
        super.activate();
        this._raidingColonyId = raidingColonyId;
        this._raidAreaCenter = raidAreaCenter;
        this._callback = callback;

        this._updateArea();
    }

    _prepareAreaData() {
        let { area, exclusions, nestPickers } = this.$domain.getRaidableArea(this._raidingColonyId, this._raidAreaCenter, ChunksVisibilityManager.getVisibleChunkIds());
        this._updateAreaData(area, exclusions, nestPickers);
    }

    _updateAreaData(pickableCircle, exclusions, nestPickers) {
        super._updateAreaData(pickableCircle, exclusions);
        this._nestPickers = nestPickers || [];
    }

    _renderAreaData() {
        super._renderAreaData();

        if (this._nestPickers.length > 0) {
            this._renderNestPickers(this._nestPickers, this._pickableCircle);
        }
    }

    _renderNestPickers(nestPickers, circleMask) {
        this._nestPickersContainer = new PIXI.Container();
        this._container.addChild(this._nestPickersContainer);

        if (circleMask) {
            this._renderCircleMaskFor(this._nestPickersContainer, circleMask);
        }

        for (let nestPicker of nestPickers) {
            let pickerGraphic = new PIXI.Graphics();
            pickerGraphic
                .circle(nestPicker.center.x, nestPicker.center.y, nestPicker.radius)
                .fill({
                    alpha: 0,
                })
                .stroke({
                    color: 0x0000ff,
                    alpha: 0.5,
                    width: 3
                });
            pickerGraphic.eventMode = 'static';
            pickerGraphic.cursor = 'pointer';
            pickerGraphic.on('pointertap', () => this._onNestPicked(nestPicker.nest));
            this._nestPickersContainer.addChild(pickerGraphic);
        }
    }

    _onNestPicked(nest) {
        this._callback(nest);
    }

    _removeNestPickers() {
        if (this._nestPickersContainer) {
            this._container.removeChild(this._nestPickersContainer);
            this._nestPickersContainer = null;
        }
    }

    _clearArea() {
        super._clearArea();
        this._removeNestPickers();
    }

}

export {
    RaidNestPickerView
}