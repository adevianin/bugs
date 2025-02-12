import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class BasePickerView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;

        this._container.on('pointerdown', this._onClick.bind(this));
    }

    activate() {
        this._container.eventMode = 'static';
        let worldSize = this.$domainFacade.getWorldSize();
        this._container.hitArea = new PIXI.Rectangle(0, 0, worldSize[0], worldSize[1]);
    }

    deactivate() {
        this._container.eventMode = 'none'; 
    }

    _onClick(e) {
        let point = this._container.toLocal(e.client);
        this._onPointPick({x: point.x, y: point.y});
    }

    _onPointPick(point) {}

}

export {
    BasePickerView
}