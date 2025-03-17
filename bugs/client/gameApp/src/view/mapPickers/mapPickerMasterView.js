import * as PIXI from 'pixi.js';
import { BaseGraphicView } from "@view/base/baseGraphicView";
import { NestPickerView } from "./nestPickerView";
import { PositionPickerView } from "./positionPickerView";
import { BorderView } from './borderView';

class MapPickerMasterView extends BaseGraphicView {

    constructor(container, borderEl) {
        super();
        this._container = container;
        this._borderEl = borderEl;

        this._render();

        this.$eventBus.on('nestPickRequest', this._onNestPickRequest.bind(this));
        this.$eventBus.on('positionPickRequest', this._onPositionPickRequest.bind(this));
        this.$eventBus.on('deactivateMapPickerRequest', this._onPickerDeactivateRequest.bind(this));
    }

    _render() {
        let positionPickerContainer = new PIXI.Container();
        this._container.addChild(positionPickerContainer);
        this._positionPickerView = new PositionPickerView(positionPickerContainer);

        let nestPickerContainer = new PIXI.Container();
        this._container.addChild(nestPickerContainer);
        this._nestPickerView = new NestPickerView(nestPickerContainer);

        this._borderView = new BorderView(this._borderEl);
    }

    _onNestPickRequest(excludeColonyId, pickableCircle, callback) {
        this._nestPickerView.activate(excludeColonyId, pickableCircle, nest => {
            callback(nest);
            this._deactivateAll();
        });
        this._borderView.activate(this.$messages.pick_nest);
    }

    _onPositionPickRequest(pickableCircle, exclusions, callback) {
        this._positionPickerView.activate(pickableCircle, exclusions, point => {
            callback(point);
            this._deactivateAll();
        });
        this._borderView.activate(this.$messages.pick_position);
    }

    _onPickerDeactivateRequest() {
        this._deactivateAll();
    }

    _deactivateAll() {
        this._nestPickerView.deactivate();
        this._positionPickerView.deactivate();
        this._borderView.deactivate();
    }

}

export {
    MapPickerMasterView
}