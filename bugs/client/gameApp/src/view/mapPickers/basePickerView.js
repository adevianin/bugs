import { BaseGraphicView } from "@view/base/baseGraphicView";
import * as PIXI from 'pixi.js';
import { distance_point } from "@utils/distance";

class BasePickerView extends BaseGraphicView {

    constructor(container) {
        super();
        this._container = container;
        this._worldSize = this.$domain.getWorldSize();

        this._render();

        this._boundOnClick = this._onClick.bind(this);
    }

    activate(pickableCircle, exclusions) {
        this._container.renderable = true;
        if (pickableCircle) {
            this._pickableCircle = pickableCircle;
            this._exclusions = exclusions;
            this._renderPickableArea(pickableCircle, exclusions);
        } else {
            this._clearPickableArea();
        }

        this.$eventBus.on('bgclick', this._boundOnClick);
    }

    deactivate() {
        this._container.renderable = false;
        this._pickableCircle = null;
        this._exclusions = null;
        this.$eventBus.off('bgclick', this._boundOnClick);
    }

    _render() {
        this._container.renderable = false;
    }

    _renderPickableArea(pickableCircle, exclusions) {
        this._clearPickableArea();

        this._notPickableArea = new PIXI.Graphics();
        this._notPickableArea.rect(0, 0, this._worldSize[0], this._worldSize[1])
        .fill({
            color: 0xff0000,
            alpha: 0.5,
        })
        .circle(pickableCircle.center.x, pickableCircle.center.y, pickableCircle.radius)
        .cut();

        this._container.addChild(this._notPickableArea);

        if (exclusions && exclusions.length > 0) {
            this._pickableCircleExclusionsContainer = new PIXI.Container();
            let mask = new PIXI.Graphics();
            mask.circle(pickableCircle.center.x, pickableCircle.center.y, pickableCircle.radius);
            mask.fill(0x0000ff);
            this._pickableCircleExclusionsContainer.mask = mask;
            this._pickableCircleExclusionsContainer.addChild(mask);
            this._container.addChild(this._pickableCircleExclusionsContainer);

            for (let exclusion of exclusions) {
                let excelusionGraphic = new PIXI.Graphics();
                excelusionGraphic
                .circle(exclusion.center.x, exclusion.center.y, exclusion.radius)
                .fill({
                    color: 0xff0000,
                    alpha: 0.5,
                });
                this._pickableCircleExclusionsContainer.addChild(excelusionGraphic);
            }
        }
    }

    _clearPickableArea() {
        if (this._notPickableArea) {
            this._container.removeChild(this._notPickableArea);
            this._notPickableArea = null;
        }
        if (this._pickableCircleExclusionsContainer) {
            this._container.removeChild(this._pickableCircleExclusionsContainer);
            this._pickableCircleExclusionsContainer = null;
        }
    }

    _onClick(point) {
        if (this._pickableCircle) {
            let dist = distance_point(this._pickableCircle.center, point);
            if (dist >= this._pickableCircle.radius) {
                return;
            }

            if (this._exclusions){
                for (let exclusion of this._exclusions) {
                    let dist = distance_point(exclusion.center, point);
                    if (dist < exclusion.radius) {
                        return;
                    }
                }
            }
        }
        this._onPointPick({x: point.x, y: point.y});
    }

    _onPointPick(point) {}

}

export {
    BasePickerView
}