import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';

class BasePickerView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._worldSize = this.$domainFacade.getWorldSize();

        this._render();
        this.deactivate();

        this._container.on('pointerdown', this._onClick.bind(this));
    }

    activate(pickableCircle) {
        this._container.renderable = true;
        if (pickableCircle) {
            this._restrictPickableAreaByCircle(pickableCircle);
        } else {
            this._clearPickableAreaRestrictions();
        }
    }

    deactivate() {
        this._container.renderable = false;
    }

    _render() {
        this._container.eventMode = 'static';
    }

    _restrictPickableAreaByCircle(pickableCircle) {
        this._clearNotPickableArea();
        this._notPickableArea = new PIXI.Graphics();
        this._notPickableArea.eventMode = 'static';
        this._notPickableArea.rect(0, 0, this._worldSize[0], this._worldSize[1])
        .fill({
            color: 0xff0000,
            alpha: 0.5,
        })
        .circle(pickableCircle.center.x, pickableCircle.center.y, pickableCircle.radius)
        .cut();

        this._container.hitArea = new PIXI.Circle(pickableCircle.center.x, pickableCircle.center.y, pickableCircle.radius);

        this._container.addChild(this._notPickableArea);
    }

    _clearPickableAreaRestrictions() {
        this._container.hitArea = new PIXI.Rectangle(0, 0, this._worldSize[0], this._worldSize[1]);
        this._clearNotPickableArea();
    }

    _clearNotPickableArea() {
        if (this._notPickableArea) {
            this._container.removeChild(this._notPickableArea);
        }
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